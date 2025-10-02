import { describe, it, expect } from 'vitest'
import {
  getConversationScript,
  getNextResponse,
  getScriptedResults,
  getDetailScript,
  getDetailResponse
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
      expect(script.resultStages[0]?.[0]?.name).toBe('John Caruso')
      expect(script.resultStages[0]?.[7]?.name).toBe('John Caruso')
      expect(script.resultStages[3]?.[0]?.name).toBe('John Caruso')
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

    it('should return Robert Schmidt script for case insensitive "robert schmidt" query', () => {
      const script = getConversationScript('robert schmidt')

      expect(script.responses).toHaveLength(3)
      expect(script.responses[0]).toBe('Robert Schmidt response 1')
      expect(script.responses[1]).toBe('Robert Schmidt response 2')
      expect(script.responses[2]).toBe('Robert Schmidt response 3')

      // Test result stages
      expect(script.resultStages).toHaveLength(4)
      expect(script.resultStages[0]).toHaveLength(8) // Initial: 8 results
      expect(script.resultStages[1]).toHaveLength(4) // Stage 1: 4 results
      expect(script.resultStages[2]).toHaveLength(3) // Stage 2: 3 results
      expect(script.resultStages[3]).toHaveLength(1) // Stage 3: 1 result

      // Test result content
      expect(script.resultStages[0]?.[0]?.name).toBe('Robert Schmidt')
      expect(script.resultStages[0]?.[7]?.name).toBe('Robert Schmidt')
    })

    it('should return Robert Schmidt script for mixed case query', () => {
      const script = getConversationScript('Robert Schmidt')

      expect(script.responses).toHaveLength(3)
      expect(script.responses[0]).toBe('Robert Schmidt response 1')
      expect(script.responses[1]).toBe('Robert Schmidt response 2')
      expect(script.responses[2]).toBe('Robert Schmidt response 3')
    })

    it('should return Robert Schmidt script for uppercase query', () => {
      const script = getConversationScript('ROBERT SCHMIDT')

      expect(script.responses).toHaveLength(3)
      expect(script.responses[0]).toBe('Robert Schmidt response 1')
      expect(script.responses[1]).toBe('Robert Schmidt response 2')
      expect(script.responses[2]).toBe('Robert Schmidt response 3')
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
      expect(results[0]?.name).toBe('John Caruso')
      expect(results[7]?.name).toBe('John Caruso')
    })

    it('should return correct results for stage 1', () => {
      const results = getScriptedResults(sampleScript, 1)
      expect(results).toHaveLength(4)
      expect(results[0]?.name).toBe('John Caruso')
      expect(results[3]?.name).toBe('John Caruso')
    })

    it('should return correct results for stage 2', () => {
      const results = getScriptedResults(sampleScript, 2)
      expect(results).toHaveLength(3)
      expect(results[0]?.name).toBe('John Caruso')
      expect(results[2]?.name).toBe('John Caruso')
    })

    it('should return correct results for stage 3 (final)', () => {
      const results = getScriptedResults(sampleScript, 3)
      expect(results).toHaveLength(1)
      expect(results[0]?.name).toBe('John Caruso')
    })

    it('should return last stage for out of bounds stage', () => {
      const results = getScriptedResults(sampleScript, 10)
      expect(results).toHaveLength(1)
      expect(results[0]?.name).toBe('John Caruso')
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

  describe('Detail Scripts', () => {
    describe('getDetailScript', () => {
      it('should return John Caruso detail script for john caruso query', () => {
        const script = getDetailScript('john caruso')
        expect(script.responses).toEqual([
          'John Caruso search detail response 1',
          'John Caruso search detail response 2',
          'John Caruso search detail response 3'
        ])
      })

      it('should return Robert Schmidt detail script for robert schmidt query', () => {
        const script = getDetailScript('robert schmidt')
        expect(script.responses).toEqual([
          'Robert Schmidt search detail response 1',
          'Robert Schmidt search detail response 2',
          'Robert Schmidt search detail response 3'
        ])
      })

      it('should return Von Miller detail script for von miller query', () => {
        const script = getDetailScript('von miller')
        expect(script.responses).toEqual([
          'Von Miller search detail response 1',
          'Von Miller search detail response 2',
          'Von Miller search detail response 3'
        ])
      })

      it('should return default detail script for unknown query', () => {
        const script = getDetailScript('unknown person')
        expect(script.responses).toEqual([
          'Search detail response 1',
          'Search detail response 2',
          'Search detail response 3'
        ])
      })

      it('should handle case insensitive queries', () => {
        const script1 = getDetailScript('JOHN CARUSO')
        const script2 = getDetailScript('John Caruso')
        const script3 = getDetailScript('john caruso')

        expect(script1.responses).toEqual(script2.responses)
        expect(script2.responses).toEqual(script3.responses)
      })
    })

    describe('getDetailResponse', () => {
      it('should return correct response for valid index', () => {
        const script = getDetailScript('john caruso')
        const response = getDetailResponse(script, 0)
        expect(response).toBe('John Caruso search detail response 1')
      })

      it('should cycle responses when index exceeds array length', () => {
        const script = getDetailScript('john caruso')
        const response = getDetailResponse(script, 3) // Index 3 should cycle to index 0
        expect(response).toBe('John Caruso search detail response 1')
      })

      it('should handle large indices by cycling', () => {
        const script = getDetailScript('john caruso')
        const response = getDetailResponse(script, 7) // Index 7 should cycle to index 1
        expect(response).toBe('John Caruso search detail response 2')
      })
    })
  })
})
