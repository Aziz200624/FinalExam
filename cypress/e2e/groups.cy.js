describe('Groups frontend CRUD', () => {
  const seedGroups = [
    { id: 1, name: 'Gamers', description: 'Play together', membersCount: 25 },
    { id: 2, name: 'Readers', description: 'Book talks', membersCount: 14 },
  ];

  function mockApi(initialGroups = seedGroups) {
    let groups = JSON.parse(JSON.stringify(initialGroups));
    let nextId = 100;

    cy.intercept('GET', '/items', (req) => {
      req.reply(groups);
    }).as('getItems');

    cy.intercept('GET', /\/items\/\d+$/, (req) => {
      const id = Number(req.url.split('/').pop());
      const found = groups.find((g) => g.id === id);
      if (!found) {
        req.reply({ statusCode: 404, body: { error: 'Group not found' } });
        return;
      }
      req.reply(found);
    }).as('getItemById');

    cy.intercept('POST', '/items', (req) => {
      const group = { id: nextId++, ...req.body };
      groups.unshift(group);
      req.reply({ statusCode: 201, body: group });
    }).as('createItem');

    cy.intercept('PUT', /\/items\/\d+$/, (req) => {
      const id = Number(req.url.split('/').pop());
      const idx = groups.findIndex((g) => g.id === id);
      if (idx === -1) {
        req.reply({ statusCode: 404, body: { error: 'Group not found' } });
        return;
      }
      groups[idx] = { ...groups[idx], ...req.body, id };
      req.reply(groups[idx]);
    }).as('updateItem');

    cy.intercept('DELETE', /\/items\/\d+$/, (req) => {
      const id = Number(req.url.split('/').pop());
      const idx = groups.findIndex((g) => g.id === id);
      if (idx === -1) {
        req.reply({ statusCode: 404, body: { error: 'Group not found' } });
        return;
      }
      const [removed] = groups.splice(idx, 1);
      req.reply({ message: 'Group deleted successfully', group: removed });
    }).as('deleteItem');
  }

  beforeEach(() => {
    mockApi();
    cy.visit('/');
    cy.wait('@getItems');
    cy.on('window:confirm', () => true);
  });

  it('loads existing groups on page open', () => {
    cy.get('#groups-grid .group-card').should('have.length', 2);
    cy.contains('.group-card-title', 'Gamers').should('be.visible');
    cy.get('#total-groups').should('contain', '2');
  });

  it('opens and closes create modal', () => {
    cy.get('#new-group-btn').click();
    cy.get('#modal-overlay').should('have.class', 'active');
    cy.get('#cancel-btn').click();
    cy.get('#modal-overlay').should('not.have.class', 'active');
  });

  it('creates a new group from modal form', () => {
    cy.get('#new-group-btn').click();
    cy.get('#name').type('Developers');
    cy.get('#description').type('Code and architecture');
    cy.get('#membersCount').clear().type('30');
    cy.get('#group-form').submit();

    cy.wait('@createItem');
    cy.wait('@getItems');
    cy.contains('.toast-message', 'Group created successfully!').should('be.visible');
    cy.contains('.group-card-title', 'Developers').should('be.visible');
    cy.get('#groups-grid .group-card').should('have.length', 3);
  });

  it('shows validation when create name is empty', () => {
    cy.get('#new-group-btn').click();
    cy.get('#name').clear();
    cy.get('#group-form').submit();

    cy.contains('.toast-message', 'Please enter a group name').should('be.visible');
    cy.get('#modal-overlay').should('have.class', 'active');
  });

  it('opens edit modal with prefilled group data', () => {
    cy.contains('.group-card', 'Gamers').find('.btn-icon.edit').click();
    cy.wait('@getItemById');

    cy.get('#form-title').should('contain', 'Edit Group');
    cy.get('#name').should('have.value', 'Gamers');
    cy.get('#membersCount').should('have.value', '25');
  });

  it('updates an existing group', () => {
    cy.contains('.group-card', 'Gamers').find('.btn-icon.edit').click();
    cy.wait('@getItemById');

    cy.get('#name').clear().type('Gamers Pro');
    cy.get('#membersCount').clear().type('40');
    cy.get('#group-form').submit();

    cy.wait('@updateItem');
    cy.wait('@getItems');
    cy.contains('.toast-message', 'Group updated successfully!').should('be.visible');
    cy.contains('.group-card-title', 'Gamers Pro').should('be.visible');
  });

  it('deletes a group after confirmation', () => {
    cy.contains('.group-card', 'Readers').find('.btn-icon.delete').click();

    cy.wait('@deleteItem');
    cy.wait('@getItems');
    cy.contains('.toast-message', 'Group deleted successfully!').should('be.visible');
    cy.contains('.group-card-title', 'Readers').should('not.exist');
    cy.get('#groups-grid .group-card').should('have.length', 1);
  });

  it('renders empty state when backend returns no groups', () => {
    mockApi([]);
    cy.visit('/');
    cy.wait('@getItems');

    cy.get('#empty-state').should('be.visible');
    cy.get('#groups-grid').should('not.be.visible');
  });

  it('opens create modal from empty state button', () => {
    mockApi([]);
    cy.visit('/');
    cy.wait('@getItems');

    cy.contains('button', 'Create First Group').click();
    cy.get('#modal-overlay').should('have.class', 'active');
  });

  it('escapes html in group name in rendered card', () => {
    mockApi([{ id: 20, name: '<script>alert(1)</script>', description: 'safe', membersCount: 1 }]);
    cy.visit('/');
    cy.wait('@getItems');

    cy.get('.group-card-title').should('contain', '<script>alert(1)</script>');
    cy.get('.group-card-title script').should('not.exist');
  });
});
