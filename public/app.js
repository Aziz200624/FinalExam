$(document).ready(function() {
    let isEditMode = false;
    let currentEditId = null;

    // Load all groups on page load
    loadGroups();

    // Modal controls
    $('#new-group-btn').on('click', function() {
        openModal();
    });

    $('#modal-close, #cancel-btn').on('click', function() {
        closeModal();
    });

    $('#modal-overlay').on('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });

    // Handle escape key
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // Handle form submission
    $('#group-form').on('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            name: $('#name').val().trim(),
            description: $('#description').val().trim(),
            membersCount: parseInt($('#membersCount').val()) || 0
        };

        if (!formData.name) {
            showToast('Please enter a group name', 'error');
            return;
        }

        // Add loading state
        $('#submit-btn').addClass('loading');

        if (isEditMode) {
            updateGroup(currentEditId, formData);
        } else {
            createGroup(formData);
        }
    });

    function openModal(editData = null) {
        if (editData) {
            isEditMode = true;
            currentEditId = editData.id;
            $('#form-title').text('Edit Group');
            $('#submit-btn .btn-text').text('Save Changes');
            $('#name').val(editData.name);
            $('#description').val(editData.description || '');
            $('#membersCount').val(editData.membersCount || 0);
        } else {
            isEditMode = false;
            currentEditId = null;
            $('#form-title').text('Create New Group');
            $('#submit-btn .btn-text').text('Create Group');
            $('#group-form')[0].reset();
        }
        $('#modal-overlay').addClass('active');
        setTimeout(() => $('#name').focus(), 100);
    }

    function closeModal() {
        $('#modal-overlay').removeClass('active');
        $('#submit-btn').removeClass('loading');
        setTimeout(() => {
            $('#group-form')[0].reset();
            isEditMode = false;
            currentEditId = null;
        }, 200);
    }

    // Load all groups from API
    function loadGroups() {
        $('#loading').show();
        $('#groups-grid').hide();
        $('#empty-state').hide();

        $.ajax({
            url: '/items',
            method: 'GET',
            success: function(groups) {
                setTimeout(() => {
                    $('#loading').hide();
                    displayGroups(groups);
                    updateStats(groups.length);
                }, 500); // Small delay for smooth transition
            },
            error: function(xhr) {
                $('#loading').hide();
                showToast('Failed to load groups', 'error');
                $('#empty-state').show();
            }
        });
    }

    // Display groups in the grid
    function displayGroups(groups) {
        const grid = $('#groups-grid');
        grid.empty();

        if (groups.length === 0) {
            grid.hide();
            $('#empty-state').show();
            return;
        }

        $('#empty-state').hide();
        grid.show();

        groups.forEach(function(group, index) {
            const card = `
                <div class="group-card" style="animation-delay: ${index * 0.08}s">
                    <div class="group-card-header">
                        <h3 class="group-card-title">${escapeHtml(group.name)}</h3>
                        <span class="group-card-id">#${group.id}</span>
                    </div>
                    <p class="group-card-description">${escapeHtml(group.description) || 'No description provided'}</p>
                    <div class="group-card-footer">
                        <div class="members-count">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                            <span><span class="count">${group.membersCount || 0}</span> members</span>
                        </div>
                        <div class="card-actions">
                            <button class="btn-icon edit" onclick="editGroup(${group.id})" title="Edit group">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                            </button>
                            <button class="btn-icon delete" onclick="deleteGroup(${group.id})" title="Delete group">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            grid.append(card);
        });
    }

    function updateStats(count) {
        // Animate the counter
        const el = $('#total-groups');
        const start = parseInt(el.text()) || 0;
        const end = count;
        const duration = 500;
        const startTime = performance.now();

        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(start + (end - start) * easeOutCubic(progress));
            el.text(current);
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }

        requestAnimationFrame(animate);
    }

    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    // Create a new group
    function createGroup(formData) {
        $.ajax({
            url: '/items',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function(response) {
                closeModal();
                loadGroups();
                showToast('Group created successfully!', 'success');
            },
            error: function(xhr) {
                $('#submit-btn').removeClass('loading');
                showToast('Failed to create group', 'error');
            }
        });
    }

    // Update an existing group
    function updateGroup(id, formData) {
        $.ajax({
            url: `/items/${id}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function(response) {
                closeModal();
                loadGroups();
                showToast('Group updated successfully!', 'success');
            },
            error: function(xhr) {
                $('#submit-btn').removeClass('loading');
                showToast('Failed to update group', 'error');
            }
        });
    }

    // Delete a group
    window.deleteGroup = function(id) {
        if (!confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
            return;
        }

        // Add visual feedback
        const card = $(`.group-card`).filter(function() {
            return $(this).find('.group-card-id').text() === '#' + id;
        });
        card.css({ opacity: 0.5, pointerEvents: 'none' });

        $.ajax({
            url: `/items/${id}`,
            method: 'DELETE',
            success: function(response) {
                card.css({ transform: 'scale(0.8)', opacity: 0 });
                setTimeout(() => loadGroups(), 300);
                showToast('Group deleted successfully!', 'success');
            },
            error: function(xhr) {
                card.css({ opacity: 1, pointerEvents: 'auto' });
                showToast('Failed to delete group', 'error');
            }
        });
    };

    // Edit a group - load data into form
    window.editGroup = function(id) {
        $.ajax({
            url: `/items/${id}`,
            method: 'GET',
            success: function(group) {
                openModal({
                    id: group.id,
                    name: group.name,
                    description: group.description,
                    membersCount: group.membersCount
                });
            },
            error: function(xhr) {
                showToast('Failed to load group', 'error');
            }
        });
    };

    // Show toast notification
    function showToast(message, type) {
        const toast = $(`#${type}-message`);
        toast.find('.toast-message').text(message);
        toast.addClass('show');
        
        // Add shake animation for errors
        if (type === 'error') {
            toast.css('animation', 'shake 0.5s ease');
            setTimeout(() => toast.css('animation', ''), 500);
        }
        
        setTimeout(() => {
            toast.removeClass('show');
        }, 4000);
    }

    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text ? text.replace(/[&<>"']/g, m => map[m]) : '';
    }

    // Add shake animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0) translateY(0) scale(1); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px) translateY(0) scale(1); }
            20%, 40%, 60%, 80% { transform: translateX(5px) translateY(0) scale(1); }
        }
    `;
    document.head.appendChild(style);
});
