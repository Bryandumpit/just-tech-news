//imports
const {format_date, format_plural, format_url} = require('../utils/helpers')
//the tests ensures the helpers we write has the correct functionality we need

//format Date() takes Date() objects and returns dates in the MM/DD/YYYY format

test('format_date() returns a date string', ()=> {
    const date = new Date ('2020-03-20 16:12:03');

    expect(format_date(date)).toBe('3/20/2020')
})

//format_plural() correctly pluralizes pot and comment iff there are multiple points and comments

test('format_plural() correctly pluralizes words', ()=>{
    const word = 'lion'
    const amount = 2

    expect(format_plural(word,amount)).toBe('lions')
})

//format_url() shortens urls e.g. http://test.com/page/1 becomes test.com

test('format_url() returns a simplified url string', ()=> {
    const url1 = format_url('http://test.com/page/1');
    const url2 = format_url('https://www.coolstuff.com/abcdefg/')
    const url3 = format_url('https://www.google.com?q=hello')

    expect(url1).toBe('test.com');
    expect(url2).toBe('coolstuff.com');
    expect(url3).toBe('google.com');
})