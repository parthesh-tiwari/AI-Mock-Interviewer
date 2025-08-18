import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { toast } from 'sonner'
import { Trash2, AlertTriangle, X } from 'lucide-react'

function InterviewItemCard({ interview, onDelete }) {
  const router = useRouter();
  const { user } = useUser();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const onStart = () => {
    router.push('/dashboard/interview/' + interview.mockId + '/start');
  }

  const onFeedback = () => {
    router.push('/dashboard/interview/' + interview.mockId + '/feedback');
  }

  const handleDelete = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) {
      toast.error('User not authenticated');
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch('/api/interview/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mockId: interview.mockId,
          userEmail: user.primaryEmailAddress.emailAddress,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Interview deleted successfully');
        setShowDeleteModal(false);
        // Call the parent's onDelete function to refresh the list
        if (onDelete) {
          onDelete();
        }
      } else {
        toast.error(data.error || 'Failed to delete interview');
      }
    } catch (error) {
      console.error('Error deleting interview:', error);
      toast.error('An error occurred while deleting the interview');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="border shadow rounded-xl p-4 sm:p-5 bg-white flex flex-col justify-between h-full hover:shadow-lg transition-shadow duration-200">
        <div>
          <h2 className="font-bold text-primary text-base sm:text-lg mb-1">{interview?.jobPosition}</h2>
          <h3 className="text-sm text-gray-600 mb-1">{interview?.jobExperience} Years of Experience</h3>
          <h4 className="text-xs text-gray-400 mb-3">Created At: {interview.createdAt}</h4>
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-3 mt-4">
          {/* Main Action Buttons */}
          <div className="flex gap-2 sm:gap-3">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-xs sm:text-sm min-h-[36px] sm:min-h-[40px]"
              onClick={onFeedback}
            >
              Feedback
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm min-h-[36px] sm:min-h-[40px]"
              onClick={onStart}
            >
              Start
            </Button>
          </div>
          
          {/* Delete Button */}
          <Button
            size="sm"
            variant="outline"
            className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 text-xs sm:text-sm min-h-[36px] sm:min-h-[40px]"
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Delete Interview
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Interview</h3>
                </div>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Are you sure you want to delete this interview?
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900">{interview?.jobPosition}</p>
                  <p className="text-sm text-gray-600">{interview?.jobExperience} Years of Experience</p>
                  <p className="text-xs text-gray-500">Created: {interview.createdAt}</p>
                </div>
                <p className="text-sm text-red-600 mt-3">
                  This action cannot be undone. All interview data and feedback will be permanently deleted.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  className="flex-1 min-h-[44px]"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white min-h-[44px]"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Deleting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default InterviewItemCard
