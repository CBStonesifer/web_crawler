const { test, expect } = require('@jest/globals')
const { normalizeURL, getURLsFromHTML } = require('./crawl.js')



test("Removes protocol and final forward slash", () => {
    expect(normalizeURL('https://www.boot.dev/assignments/0eb6dd92-7d44-4980-a558-2168f0db4ee5/')).toBe('www.boot.dev/assignments/0eb6dd92-7d44-4980-a558-2168f0db4ee5')
});

test("Removes protocol", () => {
    expect(normalizeURL('https://www.boot.dev/assignments/0eb6dd92-7d44-4980-a558-2168f0db4ee5')).toBe('www.boot.dev/assignments/0eb6dd92-7d44-4980-a558-2168f0db4ee5')
});

test("Fails empty url", () => {
    function emptyURL() {
        normalizeURL('');
    }
    expect(emptyURL).toThrow("Invalid URL")
});

test("Fails nonsense url", () => {
    function emptyURL() {
        normalizeURL('asdasdasdsadas');
    }
    expect(emptyURL).toThrow("Invalid URL")
});

test('getURLsFromHTML absolute', () => {
    const inputURL = 'https://blog.boot.dev'
    const inputBody = '<html><body><a href="https://blog.boot.dev"><span>Boot.dev></span></a></body></html>'
    const actual = getURLsFromHTML(inputBody, inputURL)
    const expected = [ 'https://blog.boot.dev/' ]
    expect(actual).toEqual(expected)
  })
  
  test('getURLsFromHTML relative', () => {
    const inputURL = 'https://blog.boot.dev'
    const inputBody = '<html><body><a href="/path/one"><span>Boot.dev></span></a></body></html>'
    const actual = getURLsFromHTML(inputBody, inputURL)
    const expected = [ 'https://blog.boot.dev/path/one' ]
    expect(actual).toEqual(expected)
  })
  
  test('getURLsFromHTML both', () => {
    const inputURL = 'https://blog.boot.dev'
    const inputBody = '<html><body><a href="/path/one"><span>Boot.dev></span></a><a href="https://other.com/path/one"><span>Boot.dev></span></a></body></html>'
    const actual = getURLsFromHTML(inputBody, inputURL)
    const expected = [ 'https://blog.boot.dev/path/one', 'https://other.com/path/one' ]
    expect(actual).toEqual(expected)
  })
  
  test('getURLsFromHTML handle error', () => {
    const inputURL = 'https://blog.boot.dev'
    const inputBody = '<html><body><a href="path/one"><span>Boot.dev></span></a></body></html>'
    const actual = getURLsFromHTML(inputBody, inputURL)
    const expected = [ ]
    expect(actual).toEqual(expected)
  })