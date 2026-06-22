'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'What is knowyourwomen and who is it for?',
    answer: 'knowyourwomen is a supportive relationship tool designed for partners to understand and support women through their monthly hormonal cycles. By tracking cycle phases based on user observations, it provides actionable, daily communication strategies and tips.'
  },

  {
    question: 'Is my tracked data private and secure?',
    answer: 'Absolutely. We prioritize strict user privacy. All cycle logging data is stored locally on your device and inside your secure personal account. Because knowyourwomen is designed for you to track cycle days based on your observations, we never collect, share, or monetize your partner\'s personal health data.'
  },
  {
    question: 'Do I need to sync with my partner\'s phone or calendar?',
    answer: 'No syncing is required. knowyourwomen operates as a private relationship assistant. You simply log cycle start and end dates based on your observations, and the app builds a 3-month predictive cycle calendar with custom phase-transition notifications sent directly to your phone.'
  },
  {
    question: 'Is the guidance backed by science?',
    answer: 'Yes. Every daily tip, wellness insight, and communication recommendation is vetted by relationship counselors and hormonal biologists, ensuring all guidelines are based on genuine endocrine changes rather than outdated stereotypes.'
  }
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="faq-container">
      {FAQ_ITEMS.map((item, index) => {
        const isOpen = openIndex === index
        return (
          <div
            key={index}
            className={`faq-item ${isOpen ? 'open' : ''}`}
          >
            <button
              className="faq-header"
              onClick={() => toggle(index)}
              aria-expanded={isOpen}
            >
              <span>{item.question}</span>
              <ChevronDown className="faq-chevron" size={20} />
            </button>
            <div
              className="faq-content"
              style={{
                maxHeight: isOpen ? '250px' : '0'
              }}
            >
              <div className="faq-content-inner">
                <p>{item.answer}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
