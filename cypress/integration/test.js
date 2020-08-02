const baseUrl = "http://localhost:3000"

const base = () =>{
  it('checks home page', () => {
    cy.visit(baseUrl)
    cy.get('h1').contains('My Boards')
    cy.get('.board_title').contains('Create a board...')
  })
}

const baseCreate = () => {
  base()
  it('creates a board', () => {
    cy.get('.board_title').contains('Create a board...').click()
    cy.get('.board_addBoard')
      .type('Mega board')
      .should('have.value', 'Mega board')
    cy.get('.board_options').find('button').click()
  })
}

const baseDelete = () =>{
  base()
  it('deletes a board', () => {
    cy.get('.board_title').contains('Mega board').click()
    cy.get('.boardDetail_info').find('.dropdown').click()
    cy.get('.dropdown-content').contains('Delete board').click()
  })
}

const playMega = () => {
  baseCreate()

  const createList = (list) =>{
    cy.get('.CreateList_title').click()
    cy.get('.CreateList_input')
      .type(list)
      .should('have.value', list)
    cy.get('.CreateList_options').find('button').click()
  }

  it('creates test column and one task', () => {
    createList('test')
    cy.get('.List_addTask').click()
    cy.get('.ListContainer').find('.TextArea')
      .type('You better do this')
      .should('have.value', 'You better do this')
    cy.get('.List_newTaskOptions').find('button').click()
    cy.get('.container').find('.checkmark').click()
  })
  it('creates done column and deletes the board after', () => {
    createList('done')  // wanted drag and drop with .trigger('dragstart') and drop
    cy.get('.boardDetail_info').find('.dropdown').click()
    cy.get('.dropdown-content').contains('Delete board').click()
  })
  
}

describe('Does check our trello', () => {
  baseCreate()
  baseDelete()

  playMega()

})
