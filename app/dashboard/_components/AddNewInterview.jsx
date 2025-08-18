"use client"
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { chatSession } from '@/utils/GeminiAIModal'
import { LoaderCircle, UploadCloud, FileText } from 'lucide-react'
import { MockInterview, PaidUser } from '@/utils/schema'
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs'
import moment from 'moment'
import { db } from '@/utils/db'
import { useRouter } from 'next/navigation'
import { eq } from 'drizzle-orm';

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false)
  const [jobPosition, setJobPosition] = useState();
  const [jobDescription, setJobDescription] = useState();
  const [yearsOfExperience, setYearsOfExperience] = useState();
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([]);
  const [includeDSA, setIncludeDSA] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [resumeError, setResumeError] = useState('');
  const [isPaidUser, setIsPaidUser] = useState(false);
  const router = useRouter(); 
  const { user } = useUser();

  const questionCount = process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT || 5;

  React.useEffect(() => {
    async function checkPaid() {
      if (!user?.primaryEmailAddress?.emailAddress) return;
      const paid = await db.select().from(PaidUser)
        .where(eq(PaidUser.userEmail, user.primaryEmailAddress.emailAddress));
      setIsPaidUser(paid.length > 0);
    }
    checkPaid();
  }, [user]);

  // Helper to read PDF/DOCX as text (client-side)
  const handleResumeUpload = async (e) => {
    setResumeError('');
    const file = e.target.files[0];
    if (!file) return;
    // Only allow PDF or DOCX
    if (
      file.type !== 'application/pdf' &&
      file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      setResumeError('Please upload a valid PDF or DOCX file. Other file types are not supported.');
      setResumeFile(null);
      setResumeText('');
      return;
    }
    // Warn if filename or mimetype is suspicious (e.g., .exe, .jpg, .png, .txt, .js, .py, .zip, etc.)
    const invalidExt = /\.(exe|jpg|jpeg|png|gif|bmp|txt|js|py|zip|rar|mp3|mp4|avi|mov|html|css|json|csv|svg)$/i;
    if (invalidExt.test(file.name)) {
      setResumeError('This does not look like a resume file. Please upload your actual resume in PDF or DOCX format.');
      setResumeFile(null);
      setResumeText('');
      return;
    }
    setResumeFile(file);

    try {
      if (file.type === 'application/pdf') {
        // Use local worker for pdfjs
        const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf');
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
        const reader = new FileReader();
        reader.onload = async function() {
          const typedarray = new Uint8Array(this.result);
          const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
          let text = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map(item => item.str).join(' ') + '\n';
          }
          setResumeText(text.slice(0, 5000)); // Limit to 5000 chars
        };
        reader.readAsArrayBuffer(file);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const mammoth = await import('mammoth');
        const reader = new FileReader();
        reader.onload = async function() {
          const arrayBuffer = this.result;
          const result = await mammoth.extractRawText({ arrayBuffer });
          setResumeText(result.value.slice(0, 5000)); // Limit to 5000 chars
        };
        reader.readAsArrayBuffer(file);
      }
    } catch (err) {
      setResumeError('Failed to read resume file.');
      setResumeText('');
    }
  };

  const onSubmit = async(event) => {
    setLoading(true);
    event.preventDefault();

    let resumePrompt = '';
    if (resumeText) {
      resumePrompt = `Here is the candidate's resume content (extract key skills, projects, and experience):\n${resumeText}\n`;
    }

    // If DSA is included, ask for (questionCount) normal + 1 DSA (total questionCount+1 objects)
    const InputPrompt = `
You are an AI mock interviewer.
Job Position: ${jobPosition},
Job Description / Tech Stack: ${jobDescription},
Years of Experience: ${yearsOfExperience}.
${resumePrompt}
Generate interview questions with detailed answers in JSON format.
The JSON should be an array of objects.
If a resume is provided and you can extract a specific project, job, or achievement, the first object must have "question" and "answer" fields, and the question must start with "You have mentioned in your resume..." and refer to that specific item. 
If you cannot find a specific project or experience in the resume, ask a general experience question as the first question, but do NOT use the phrase "You have mentioned in your resume".
The next ${questionCount - 1} objects should each have "question" and "answer" fields and be based on the technical skills and job description provided (not on the resume, unless relevant).
${includeDSA ? `Add one final object with "dsaQuestion" and "dsaAnswer" fields. The DSA question should be specific, include example input/output test cases, and provide a detailed theoretical explanation of the solution.` : ''}
Do NOT assume the candidate has skills not present in the resume.
Return only the JSON array.
`;

    const result = await chatSession.sendMessage(InputPrompt);
    let text = await result.response.text();
    text = text.replace(/```json|```/g, '').trim();
    const match = text.match(/(\[.*\]|\{.*\})/s);
    let parsedJson;
    try {
      parsedJson = match ? JSON.parse(match[1]) : JSON.parse(text);
    } catch (e) {
      setLoading(false);
      alert("Failed to parse AI response. Please try again.");
      return;
    }
    setJsonResponse(parsedJson);

    if(parsedJson) {
      const resp = await db.insert(MockInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp: JSON.stringify(parsedJson),
          jobPosition: jobPosition,
          jobDesc: jobDescription,
          jobExperience: yearsOfExperience,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format('DD-MM-yyyy')
        }).returning({mockId: MockInterview.mockId});
      if(resp) {
        setOpenDialog(false);
        router.push('/dashboard/interview/' + resp[0]?.mockId + '/start');
      }
    }
    setLoading(false);
  }

  // When user tries to check DSA, block if not paid
  const handleDSACheck = (e) => {
    if (!isPaidUser) {
      router.push('/dashboard/upgrade');
      return;
    }
    setIncludeDSA(e.target.checked);
  };

  return (
    <div>
      <div
        className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'
        onClick={() => setOpenDialog(true)}
      >
        <h2 className='text-lg text-center'>+ Add New</h2>
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about your job interviewing
            </DialogTitle>
            <DialogDescription>
              <span className="block text-gray-500 mt-2">
                Optionally upload your resume (PDF or DOCX). Some questions will be tailored to your resume!
              </span>
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onSubmit}>
            <div>
              <div className='mt-7 my-2'>
                <label> Job Role/ Job Position </label>
                <Input placeholder="Ex. Full Stack Developer" required 
                  onChange={(event) => setJobPosition(event.target.value)}
                />
              </div>
              <div className='my-3'>
                <label> Job Description / Tech Stack in Short </label>
                <Textarea placeholder="Ex. React, Angular, Spring Boot etc." required 
                  onChange={(event) => setJobDescription(event.target.value)}
                />
              </div>
              <div className='my-3'>
                <label> Years of Experience </label>
                <Input placeholder="Ex. 5" type="number" max="50" required 
                  onChange={(event) => setYearsOfExperience(event.target.value)}
                />
              </div>
              {/* Resume Upload UI */}
              <div className="my-3">
                <label className="block mb-1 font-medium">Upload Resume (optional)</label>
                <label htmlFor="resume-upload" className="flex items-center gap-3 px-4 py-2 border-2 border-dashed border-blue-400 rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition">
                  <UploadCloud className="w-6 h-6 text-blue-500" />
                  <span className="text-blue-700 font-medium">
                    {resumeFile ? resumeFile.name : "Choose PDF or DOCX file"}
                  </span>
                  <input
                    id="resume-upload"
                    type="file"
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="hidden"
                    onChange={handleResumeUpload}
                  />
                  {resumeFile && <FileText className="w-5 h-5 text-green-500" />}
                </label>
                {resumeError && <div className="text-red-600 text-sm mt-1">{resumeError}</div>}
                {resumeFile && !resumeError && (
                  <div className="text-green-700 text-xs mt-1">Resume uploaded successfully!</div>
                )}
              </div>
              <div className='my-3 flex items-center gap-2'>
                <input
                  type="checkbox"
                  id="includeDSA"
                  checked={includeDSA}
                  onChange={handleDSACheck}
                  disabled={!isPaidUser && includeDSA}
                />
                <label htmlFor="includeDSA" className="text-sm">
                  Include a DSA question (code editor)
                  {!isPaidUser && (
                    <span className="ml-2 text-xs text-blue-600">(Upgrade required)</span>
                  )}
                </label>
              </div>
            </div>
            <div className='flex gap-5 justify-end mt-5 cursor-pointer'>
              <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button type="submit" disabled={loading} className="cursor-pointer" >
                {loading ?
                  <>
                    <LoaderCircle className='animate-spin' /> Generating Questions...
                  </> : 'Start Interview'
                }
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AddNewInterview
