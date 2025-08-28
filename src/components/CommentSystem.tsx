import React, { useState, useEffect, useMemo } from 'react';

interface Comment {
  id: string;
  content: string;
  author: string;
  authorRole: 'Founder' | 'Investor' | 'Advisor' | 'Team Member' | 'Other';
  timestamp: string;
  parentId?: string; // For replies
  replies: Comment[];
  tags: string[];
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  attachments?: string[];
  mentions: string[];
  isEdited: boolean;
  editHistory?: string[];
}

interface CommentSystemProps {
  entityId: string; // ID of the entity being commented on (scenario, founder, etc.)
  entityType: 'scenario' | 'founder' | 'funding-round' | 'esop-grant' | 'company';
  entityName: string;
  onCommentsChange: (comments: Comment[]) => void;
  currentUser: {
    name: string;
    role: 'Founder' | 'Investor' | 'Advisor' | 'Team Member' | 'Other';
    avatar?: string;
  };
}

const CommentSystem: React.FC<CommentSystemProps> = ({
  entityId,
  entityType,
  entityName,
  onCommentsChange,
  currentUser
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showResolved, setShowResolved] = useState(false);
  const [sortBy, setSortBy] = useState<'timestamp' | 'priority' | 'author'>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Sample initial comments
  useEffect(() => {
    const sampleComments: Comment[] = [
      {
        id: 'comment-1',
        content: 'This exit valuation seems optimistic given current market conditions. Consider adding a more conservative scenario.',
        author: 'Sarah Chen',
        authorRole: 'Advisor',
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        replies: [],
        tags: ['valuation', 'market-analysis', 'risk-assessment'],
        priority: 'High',
        status: 'Open',
        mentions: ['@founder-team'],
        isEdited: false
      },
      {
        id: 'comment-2',
        content: 'Great point Sarah! We should definitely model a bear case scenario. I\'ll update the projections.',
        author: 'Mike Rodriguez',
        authorRole: 'Founder',
        timestamp: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
        replies: [],
        tags: ['action-item', 'projections', 'bear-case'],
        priority: 'Medium',
        status: 'In Progress',
        mentions: ['@sarah-chen'],
        isEdited: false
      },
      {
        id: 'comment-3',
        content: 'The ESOP pool size looks good for attracting top talent. Have we considered the impact of future funding rounds?',
        author: 'David Kim',
        authorRole: 'Investor',
        timestamp: new Date(Date.now() - 21600000).toISOString(), // 6 hours ago
        replies: [],
        tags: ['esop', 'talent', 'funding-impact'],
        priority: 'Medium',
        status: 'Open',
        mentions: [],
        isEdited: false
      }
    ];
    setComments(sampleComments);
  }, []);

  // Filter and sort comments
  const filteredAndSortedComments = useMemo(() => {
    let filtered = comments.filter(comment => {
      // Filter by status
      if (filterStatus !== 'all' && comment.status !== filterStatus) return false;
      
      // Filter by priority
      if (filterPriority !== 'all' && comment.priority !== filterPriority) return false;
      
      // Filter by search term
      if (searchTerm && !comment.content.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !comment.author.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !comment.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) {
        return false;
      }
      
      // Filter resolved comments
      if (!showResolved && comment.status === 'Resolved') return false;
      
      return true;
    });

    // Sort comments
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'timestamp':
          aValue = new Date(a.timestamp);
          bValue = new Date(b.timestamp);
          break;
        case 'priority':
          const priorityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder];
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder];
          break;
        case 'author':
          aValue = a.author.toLowerCase();
          bValue = b.author.toLowerCase();
          break;
        default:
          aValue = new Date(a.timestamp);
          bValue = new Date(b.timestamp);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [comments, filterStatus, filterPriority, searchTerm, showResolved, sortBy, sortOrder]);

  // Add new comment
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: `comment-${Date.now()}`,
      content: newComment,
      author: currentUser.name,
      authorRole: currentUser.role,
      timestamp: new Date().toISOString(),
      replies: [],
      tags: extractTags(newComment),
      priority: 'Medium',
      status: 'Open',
      mentions: extractMentions(newComment),
      isEdited: false
    };
    
    const updatedComments = [...comments, comment];
    setComments(updatedComments);
    onCommentsChange(updatedComments);
    setNewComment('');
  };

  // Add reply to comment
  const handleAddReply = (parentId: string, replyContent: string) => {
    const reply: Comment = {
      id: `reply-${Date.now()}`,
      content: replyContent,
      author: currentUser.name,
      authorRole: currentUser.role,
      timestamp: new Date().toISOString(),
      parentId,
      replies: [],
      tags: extractTags(replyContent),
      priority: 'Low',
      status: 'Open',
      mentions: extractMentions(replyContent),
      isEdited: false
    };
    
    const updatedComments = comments.map(comment => {
      if (comment.id === parentId) {
        return { ...comment, replies: [...comment.replies, reply] };
      }
      return comment;
    });
    
    setComments(updatedComments);
    onCommentsChange(updatedComments);
    setReplyTo(null);
  };

  // Edit comment
  const handleEditComment = (commentId: string, newContent: string) => {
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          content: newContent,
          isEdited: true,
          editHistory: [...(comment.editHistory || []), comment.content]
        };
      }
      return comment;
    });
    
    setComments(updatedComments);
    onCommentsChange(updatedComments);
    setEditingComment(null);
    setEditContent('');
  };

  // Update comment status
  const handleStatusChange = (commentId: string, newStatus: Comment['status']) => {
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, status: newStatus };
      }
      return comment;
    });
    
    setComments(updatedComments);
    onCommentsChange(updatedComments);
  };

  // Update comment priority
  const handlePriorityChange = (commentId: string, newPriority: Comment['priority']) => {
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, priority: newPriority };
      }
      return comment;
    });
    
    setComments(updatedComments);
    onCommentsChange(updatedComments);
  };

  // Delete comment
  const handleDeleteComment = (commentId: string) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      const updatedComments = comments.filter(comment => comment.id !== commentId);
      setComments(updatedComments);
      onCommentsChange(updatedComments);
    }
  };

  // Extract tags from comment content
  const extractTags = (content: string): string[] => {
    const tagMatches = content.match(/#(\w+)/g);
    return tagMatches ? tagMatches.map(tag => tag.slice(1)) : [];
  };

  // Extract mentions from comment content
  const extractMentions = (content: string): string[] => {
    const mentionMatches = content.match(/@(\w+)/g);
    return mentionMatches ? mentionMatches.map(mention => mention.slice(1)) : [];
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Get priority color
  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'Critical': return 'critical';
      case 'High': return 'high';
      case 'Medium': return 'medium';
      case 'Low': return 'low';
      default: return 'medium';
    }
  };

  // Get status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Open': return 'open';
      case 'In Progress': return 'progress';
      case 'Resolved': return 'resolved';
      case 'Closed': return 'closed';
      default: return 'open';
    }
  };

  return (
    <div className="comment-system">
      <div className="comment-header">
        <h3>💬 Comments & Feedback</h3>
        <p>Collaborate on {entityName} - share insights, ask questions, and track action items</p>
      </div>

      {/* Comment Controls */}
      <div className="comment-controls">
        <div className="controls-left">
          <input
            type="text"
            placeholder="Search comments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
          
          <select 
            value={filterPriority} 
            onChange={(e) => setFilterPriority(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Priority</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        
        <div className="controls-right">
          <label className="show-resolved">
            <input
              type="checkbox"
              checked={showResolved}
              onChange={(e) => setShowResolved(e.target.checked)}
            />
            Show Resolved
          </label>
          
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as any)}
            className="sort-select"
          >
            <option value="timestamp">Sort by Time</option>
            <option value="priority">Sort by Priority</option>
            <option value="author">Sort by Author</option>
          </select>
          
          <button 
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="sort-order-btn"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Add New Comment */}
      <div className="add-comment-section">
        <div className="comment-input-container">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={`Add a comment about ${entityName}... Use #tags and @mentions`}
            className="comment-input"
            rows={3}
          />
          <div className="comment-input-footer">
            <div className="input-tips">
              <span className="tip">#tags</span>
              <span className="tip">@mentions</span>
              <span className="tip">**bold**</span>
            </div>
            <button 
              onClick={handleAddComment}
              className="add-comment-btn"
              disabled={!newComment.trim()}
            >
              💬 Add Comment
            </button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="comments-list">
        {filteredAndSortedComments.length === 0 ? (
          <div className="no-comments">
            <div className="no-comments-icon">💬</div>
            <h4>No Comments Yet</h4>
            <p>Be the first to share your thoughts on {entityName}</p>
          </div>
        ) : (
          filteredAndSortedComments.map((comment) => (
            <div key={comment.id} className={`comment-item ${comment.status.toLowerCase()}`}>
              {/* Comment Header */}
              <div className="comment-header-row">
                <div className="comment-author">
                  <div className="author-avatar">
                    {comment.author.charAt(0).toUpperCase()}
                  </div>
                  <div className="author-info">
                    <span className="author-name">{comment.author}</span>
                    <span className="author-role">{comment.authorRole}</span>
                  </div>
                </div>
                
                <div className="comment-meta">
                  <span className="comment-timestamp">{formatTimestamp(comment.timestamp)}</span>
                  {comment.isEdited && <span className="edited-badge">(edited)</span>}
                </div>
                
                <div className="comment-controls">
                  <select
                    value={comment.priority}
                    onChange={(e) => handlePriorityChange(comment.id, e.target.value as Comment['priority'])}
                    className={`priority-select priority-${getPriorityColor(comment.priority)}`}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                  
                  <select
                    value={comment.status}
                    onChange={(e) => handleStatusChange(comment.id, e.target.value as Comment['status'])}
                    className={`status-select status-${getStatusColor(comment.status)}`}
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                  
                  {comment.author === currentUser.name && (
                    <>
                      <button 
                        onClick={() => {
                          setEditingComment(comment.id);
                          setEditContent(comment.content);
                        }}
                        className="edit-btn"
                        title="Edit comment"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDeleteComment(comment.id)}
                        className="delete-btn"
                        title="Delete comment"
                      >
                        🗑️
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Comment Content */}
              <div className="comment-content">
                {editingComment === comment.id ? (
                  <div className="edit-comment">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="edit-input"
                      rows={3}
                    />
                    <div className="edit-actions">
                      <button 
                        onClick={() => handleEditComment(comment.id, editContent)}
                        className="save-edit-btn"
                      >
                        Save
                      </button>
                      <button 
                        onClick={() => {
                          setEditingComment(null);
                          setEditContent('');
                        }}
                        className="cancel-edit-btn"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p>{comment.content}</p>
                )}
              </div>

              {/* Comment Tags */}
              {comment.tags.length > 0 && (
                <div className="comment-tags">
                  {comment.tags.map(tag => (
                    <span key={tag} className="comment-tag">#{tag}</span>
                  ))}
                </div>
              )}

              {/* Comment Mentions */}
              {comment.mentions.length > 0 && (
                <div className="comment-mentions">
                  {comment.mentions.map(mention => (
                    <span key={mention} className="comment-mention">@{mention}</span>
                  ))}
                </div>
              )}

              {/* Comment Actions */}
              <div className="comment-actions">
                <button 
                  onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                  className="reply-btn"
                >
                  💬 Reply
                </button>
                
                <span className="replies-count">
                  {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                </span>
              </div>

              {/* Reply Input */}
              {replyTo === comment.id && (
                <div className="reply-input-container">
                  <textarea
                    placeholder="Write your reply..."
                    className="reply-input"
                    rows={2}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.ctrlKey) {
                        const target = e.target as HTMLTextAreaElement;
                        handleAddReply(comment.id, target.value);
                      }
                    }}
                  />
                  <div className="reply-actions">
                    <button 
                      onClick={(e) => {
                        const target = e.target as HTMLButtonElement;
                        const replyInput = target.parentElement?.querySelector('.reply-input') as HTMLTextAreaElement;
                        if (replyInput) {
                          handleAddReply(comment.id, replyInput.value);
                        }
                      }}
                      className="add-reply-btn"
                    >
                      Reply
                    </button>
                    <button 
                      onClick={() => setReplyTo(null)}
                      className="cancel-reply-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Replies */}
              {comment.replies.length > 0 && (
                <div className="replies-container">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="reply-item">
                      <div className="reply-header">
                        <div className="reply-author">
                          <span className="author-name">{reply.author}</span>
                          <span className="author-role">{reply.authorRole}</span>
                        </div>
                        <span className="reply-timestamp">{formatTimestamp(reply.timestamp)}</span>
                      </div>
                      <div className="reply-content">
                        <p>{reply.content}</p>
                      </div>
                      {reply.tags.length > 0 && (
                        <div className="reply-tags">
                          {reply.tags.map(tag => (
                            <span key={tag} className="reply-tag">#{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Comments Summary */}
      <div className="comments-summary">
        <div className="summary-stats">
          <span className="stat-item">
            <span className="stat-label">Total Comments:</span>
            <span className="stat-value">{comments.length}</span>
          </span>
          <span className="stat-item">
            <span className="stat-label">Open Issues:</span>
            <span className="stat-value">{comments.filter(c => c.status === 'Open').length}</span>
          </span>
          <span className="stat-item">
            <span className="stat-label">High Priority:</span>
            <span className="stat-value">{comments.filter(c => c.priority === 'High' || c.priority === 'Critical').length}</span>
          </span>
          <span className="stat-item">
            <span className="stat-label">Resolved:</span>
            <span className="stat-value">{comments.filter(c => c.status === 'Resolved').length}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default CommentSystem;
