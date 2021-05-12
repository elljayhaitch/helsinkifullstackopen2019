import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'

test('BlogForm updates parent state and calls onSubmit', () => {
  const setNotification = jest.fn()

  const component = render(
    <BlogForm setNotification={setNotification} />
  )

  const input = component.getByTestId('title-input')
  const form = component.container.querySelector('form')

  fireEvent.change(input, {
    target: { value: 'testing of forms could be easier' }
  })
  fireEvent.submit(form)

  expect(setNotification.mock.calls).toHaveLength(1)
  expect(setNotification.mock.calls[0][0].content).toBe('testing of forms could be easier')
})