import * as Headless from '@headlessui/react'
import { Link as RouterLink } from 'react-router-dom'
import React, { forwardRef } from 'react'

export const Link = forwardRef(function Link(
  props: { href: string } & React.ComponentPropsWithoutRef<'a'>,
  ref: React.ForwardedRef<HTMLAnchorElement>
) {
  const { href, ...rest } = props
  const isExternal = href.startsWith('http://') || href.startsWith('https://')
  
  if (isExternal) {
    return (
      <Headless.DataInteractive>
        <a {...rest} href={href} ref={ref} />
      </Headless.DataInteractive>
    )
  }
  
  return (
    <Headless.DataInteractive>
      <RouterLink to={href} {...rest} ref={ref as any} />
    </Headless.DataInteractive>
  )
})
