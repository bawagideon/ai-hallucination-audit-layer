// AI Hallucination & Grounding Audit Layer Engine
class AIHallucinationAuditLayer {
  auditAnswer(aiAnswer, groundTruthDocs) {
    const sentences = (aiAnswer || '').split(/\.\s+/).filter(s => s.trim().length > 0);
    const combinedTruth = (groundTruthDocs || []).join(' ').toLowerCase();

    const auditedSentences = sentences.map(sentence => {
      const lower = sentence.toLowerCase();
      // Extract key words (>4 chars) to verify grounding presence
      const words = lower.match(/\b[a-z]{5,}\b/g) || [];
      const supportedCount = words.filter(w => combinedTruth.includes(w)).length;
      const isGrounded = words.length === 0 || (supportedCount / words.length) >= 0.5;

      return {
        sentence,
        isGrounded,
        groundingScore: words.length > 0 ? Math.round((supportedCount / words.length) * 100) : 100
      };
    });

    const total = auditedSentences.length;
    const grounded = auditedSentences.filter(s => s.isGrounded).length;
    const overallScore = total > 0 ? Math.round((grounded / total) * 100) : 100;

    return {
      totalClaims: total,
      groundedClaims: grounded,
      hallucinatedClaims: total - grounded,
      overallFaithfulnessScore: overallScore,
      isReliable: overallScore >= 80,
      claims: auditedSentences
    };
  }
}

module.exports = { AIHallucinationAuditLayer };
