const baseUrl = "http://localhost:3000"

describe('Trello', () => {
    it('Check trello', () => {
        browser.url(baseUrl)
        expect(browser).toHaveTitle('Trello')
    })
    it('clicks through', () => {
      const elem = $('.board_title')
      expect(elem).toHaveText('Create a board...')
      elem.click()
      $('.board_newItem').click()
      $('.board_addBoard').setValue('New test')
      $('button=Save').click()
    })
    it('deletes the board', () => {
      $('.boardDetail_info').$('.dropdown').click()
      $('span=Delete board').click()
    })
})
