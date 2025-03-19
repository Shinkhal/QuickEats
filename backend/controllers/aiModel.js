export function predictLeadQuality(orderFrequency, cartAbandonmentRate, sessionDuration) {
    // Weighted AI-based heuristic scoring system
    let score =
      orderFrequency * 15 -       // More orders, higher score
      cartAbandonmentRate * 2 +   // Less abandonment, higher score
      sessionDuration / 8;        // Longer sessions, higher score
  
    return Math.round(score);
  }