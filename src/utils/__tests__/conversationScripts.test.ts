import { describe, it, expect } from 'vitest'
import {
  getConversationScript,
  getNextResponse,
  getScriptedResults
} from '../conversationScripts'

describe('conversationScripts', () => {
  describe('getConversationScript', () => {
    it('should return John Caruso script for case insensitive "john caruso" query', () => {
      const script = getConversationScript('john caruso')

      expect(script.responses).toHaveLength(3)
      expect(script.responses[0]).toBe('John Caruso response 1')
      expect(script.responses[1]).toBe('John Caruso response 2')
      expect(script.responses[2]).toBe('John Caruso response 3')

      // Test result stages
      expect(script.resultStages).toHaveLength(4)
      expect(script.resultStages[0]).toHaveLength(8) // Initial: 8 results
      expect(script.resultStages[1]).toHaveLength(4) // Stage 1: 4 results
      expect(script.resultStages[2]).toHaveLength(3) // Stage 2: 3 results
      expect(script.resultStages[3]).toHaveLength(1) // Stage 3: 1 result

      // Test result content
      expect(script.resultStages[0]?.[0]?.name).toBe('John Caruso 1')
      expect(script.resultStages[0]?.[7]?.name).toBe('John Caruso 8')
      expect(script.resultStages[3]?.[0]?.name).toBe('John Caruso 2')
    })

    it('should return John Caruso script for mixed case query', () => {
      const script = getConversationScript('John Caruso')

      expect(script.responses).toHaveLength(3)
      expect(script.responses[0]).toBe('John Caruso response 1')
      expect(script.responses[1]).toBe('John Caruso response 2')
      expect(script.responses[2]).toBe('John Caruso response 3')
    })

    it('should return John Caruso script for uppercase query', () => {
      const script = getConversationScript('JOHN CARUSO')

      expect(script.responses).toHaveLength(3)
      expect(script.responses[0]).toBe('John Caruso response 1')
      expect(script.responses[1]).toBe('John Caruso response 2')
      expect(script.responses[2]).toBe('John Caruso response 3')
    })

    it('should return Von Miller script for case insensitive "von miller" query', () => {
      const script = getConversationScript('von miller')

      expect(script.responses).toHaveLength(3)
      expect(script.responses[0]).toBe('Von Miller response 1')
      expect(script.responses[1]).toBe('Von Miller response 2')
      expect(script.responses[2]).toBe('Von Miller response 3')
    })

    it('should return Von Miller script for mixed case query', () => {
      const script = getConversationScript('Von Miller')

      expect(script.responses).toHaveLength(3)
      expect(script.responses[0]).toBe('Von Miller response 1')
      expect(script.responses[1]).toBe('Von Miller response 2')
      expect(script.responses[2]).toBe('Von Miller response 3')
    })

    it('should return Von Miller script for uppercase query', () => {
      const script = getConversationScript('VON MILLER')

      expect(script.responses).toHaveLength(3)
      expect(script.responses[0]).toBe('Von Miller response 1')
      expect(script.responses[1]).toBe('Von Miller response 2')
      expect(script.responses[2]).toBe('Von Miller response 3')
    })

    it('should return default script for unrecognized queries', () => {
      const script = getConversationScript('John Smith')

      expect(script.responses).toHaveLength(3)
      expect(script.responses[0]).toBe('Default response 1')
      expect(script.responses[1]).toBe('Default response 2')
      expect(script.responses[2]).toBe('Default response 3')
    })

    it('should handle partial matches in longer queries', () => {
      const script = getConversationScript(
        'Looking for john caruso from california'
      )

      expect(script.responses).toHaveLength(3)
      expect(script.responses[0]).toBe('John Caruso response 1')
      expect(script.responses[1]).toBe('John Caruso response 2')
      expect(script.responses[2]).toBe('John Caruso response 3')
    })

    it('should handle empty query', () => {
      const script = getConversationScript('')

      expect(script.responses).toHaveLength(3)
      expect(script.responses[0]).toBe('Default response 1')
      expect(script.responses[1]).toBe('Default response 2')
      expect(script.responses[2]).toBe('Default response 3')
    })

    it('should handle whitespace-only query', () => {
      const script = getConversationScript('   ')

      expect(script.responses).toHaveLength(3)
      expect(script.responses[0]).toBe('Default response 1')
      expect(script.responses[1]).toBe('Default response 2')
      expect(script.responses[2]).toBe('Default response 3')
    })
  })

  describe('getScriptedResults', () => {
    const sampleScript = getConversationScript('john caruso')

    it('should return correct results for stage 0 (initial)', () => {
      const results = getScriptedResults(sampleScript, 0)
      expect(results).toHaveLength(8)
      expect(results[0]?.name).toBe('John Caruso 1')
      expect(results[7]?.name).toBe('John Caruso 8')
    })

    it('should return correct results for stage 1', () => {
      const results = getScriptedResults(sampleScript, 1)
      expect(results).toHaveLength(4)
      expect(results[0]?.name).toBe('John Caruso 1')
      expect(results[3]?.name).toBe('John Caruso 6')
    })

    it('should return correct results for stage 2', () => {
      const results = getScriptedResults(sampleScript, 2)
      expect(results).toHaveLength(3)
      expect(results[0]?.name).toBe('John Caruso 1')
      expect(results[2]?.name).toBe('John Caruso 4')
    })

    it('should return correct results for stage 3 (final)', () => {
      const results = getScriptedResults(sampleScript, 3)
      expect(results).toHaveLength(1)
      expect(results[0]?.name).toBe('John Caruso 2')
    })

    it('should return last stage for out of bounds stage', () => {
      const results = getScriptedResults(sampleScript, 10)
      expect(results).toHaveLength(1)
      expect(results[0]?.name).toBe('John Caruso 2')
    })
  })

  describe('getNextResponse', () => {
    const sampleScript = {
      responses: ['Query response 1', 'Query response 2', 'Query response 3'],
      resultStages: []
    }

    it('should return first response for index 0', () => {
      const response = getNextResponse(sampleScript, 0)
      expect(response).toBe('Query response 1')
    })

    it('should return second response for index 1', () => {
      const response = getNextResponse(sampleScript, 1)
      expect(response).toBe('Query response 2')
    })

    it('should return third response for index 2', () => {
      const response = getNextResponse(sampleScript, 2)
      expect(response).toBe('Query response 3')
    })

    it('should return default response when index exceeds script length', () => {
      const response = getNextResponse(sampleScript, 3)
      expect(response).toBe(
        "Based on the additional information you provided I have narrowed the list of potential matches. Would you like to provide additional details, or do you see the person you're looking for?"
      )
    })

    it('should return default response for negative index', () => {
      const response = getNextResponse(sampleScript, -1)
      expect(response).toBe(
        "Based on the additional information you provided I have narrowed the list of potential matches. Would you like to provide additional details, or do you see the person you're looking for?"
      )
    })

    it('should handle empty script responses array', () => {
      const emptyScript = { responses: [], resultStages: [] }
      const response = getNextResponse(emptyScript, 0)
      expect(response).toBe(
        "Based on the additional information you provided I have narrowed the list of potential matches. Would you like to provide additional details, or do you see the person you're looking for?"
      )
    })
  })
})
