import React, { useState } from 'react';
import { taskService } from '../../services/services_taskService';
import { Task } from '../../types/types_task.types';

interface Props {
  projectId: string;
  onClose: () => void;
  onTaskCreated: (task: Task) => void;
}

const CreateTaskModal: React.FC<Props> = ({ projectId, onClose, onTaskCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    dueDate: '',
    isCompleted: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);

    try {
      const task = await taskService.createTask(projectId, {
        title: formData.title.trim(),
        dueDate: formData.dueDate || undefined,
        isCompleted: formData.isCompleted,
      });
      onTaskCreated(task);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Task</h2>
          <button onClick={onClose} className="btn-close">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">
              Task Title <span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              maxLength={200}
              placeholder="Enter task title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">Due Date (optional)</label>
            <input
              type="date"
              id="dueDate"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>

          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="isCompleted"
              checked={formData.isCompleted}
              onChange={(e) => setFormData({ ...formData, isCompleted: e.target.checked })}
            />
            <label htmlFor="isCompleted">Mark as completed</label>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Adding...' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
