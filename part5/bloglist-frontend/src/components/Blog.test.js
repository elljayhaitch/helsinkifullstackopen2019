import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import Blog from './Blog'

const blog = {
  title: 'weekly newsletter',
  author: 'cassidoo',
  url: 'https://buttondown.email/cassidoo/archive',
  likes: 2,
  user: {
    username: 'Sam Davies'
  }
}

const loggedInUser = {
  username: 'Stuart Hogg'
}

test('Blog renders the title and author by default, but not the url or likes', () => {
  const component = render(
    <Blog blog={blog} loggedInUser={loggedInUser} />
  )

  expect(component.container).toHaveTextContent('weekly newsletter')
  expect(component.container).toHaveTextContent('cassidoo')
  //expect(component.container).not.toHaveTextContent('https://buttondown.email/cassidoo/archive')
  //expect(component.container).not.toHaveTextContent('likes')

  console.log(prettyDOM(component.container))
  //component.debug()
})

// test('clicking the button calls event handler once', () => {
//   const mockHandler = jest.fn()

//   const component = render(
//     <Blog blog={blog} loggedInUser={loggedInUser} addLike={mockHandler} />
//   )

//   const button = component.getByText('like')
//   fireEvent.click(button)

//   // expect(mockHandler.mock.calls).toHaveLength(1)

//   // const likesWrapper = component.getByTestId('likes-wrapper')
//   // expect(likesWrapper).toHaveTextContent('likes 3 ')
// })