/**
 * AI-Powered Recommendation Engine
 * Collaborative Filtering, Content-Based, Hybrid, and Neural Collaborative Filtering (NCF)
 */

class RecommendationEngine {
  /**
   * Hybrid Recommendation System
   * Combines collaborative filtering + content-based filtering
   */
  getRecommendations(userId, options = {}) {
    const { limit = 10, minScore = 0.5 } = options;
    
    // Get collaborative filtering recommendations
    const cfRecommendations = this.collaborativeFiltering(userId);
    
    // Get content-based recommendations
    const cbRecommendations = this.contentBasedFiltering(userId);
    
    // Combine with weighted average (70% CF, 30% CB)
    const hybridScores = {};
    
    cfRecommendations.forEach(rec => {
      hybridScores[rec.product_id] = (rec.score * 0.7) + (hybridScores[rec.product_id] || 0);
    });
    
    cbRecommendations.forEach(rec => {
      hybridScores[rec.product_id] = (hybridScores[rec.product_id] || 0) + (rec.score * 0.3);
    });
    
    // Sort and filter
    const recommendations = Object.entries(hybridScores)
      .map(([productId, score]) => ({
        product_id: parseInt(productId),
        recommendation_score: score,
        confidence: score > 0.7 ? 'high' : score > 0.5 ? 'medium' : 'low'
      }))
      .filter(rec => rec.recommendation_score >= minScore)
      .sort((a, b) => b.recommendation_score - a.recommendation_score)
      .slice(0, limit);
    
    return {
      user_id: userId,
      recommendations,
      algorithm: 'hybrid_cf_cb',
      generated_at: new Date().toISOString()
    };
  }

  /**
   * Collaborative Filtering (User-User)
   * Matrix Factorization approach
   */
  collaborativeFiltering(userId) {
    // Simulate user-item matrix
    const userItemMatrix = this.getUserItemMatrix();
    
    // Find similar users using cosine similarity
    const similarUsers = this.findSimilarUsers(userId, userItemMatrix);
    
    // Get recommendations from similar users
    const recommendations = {};
    
    similarUsers.forEach(({ userId: similarUserId, similarity }) => {
      const userItems = userItemMatrix[similarUserId] || {};
      Object.entries(userItems).forEach(([productId, rating]) => {
        if (!userItemMatrix[userId]?.[productId]) {
          recommendations[productId] = (recommendations[productId] || 0) + (rating * similarity);
        }
      });
    });
    
    return Object.entries(recommendations)
      .map(([productId, score]) => ({
        product_id: parseInt(productId),
        score: Math.min(score, 1),
        method: 'collaborative_filtering'
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);
  }

  /**
   * Content-Based Filtering
   * Item similarity based on features
   */
  contentBasedFiltering(userId) {
    // Get user's purchase history
    const userProfile = this.getUserProfile(userId);
    
    // Calculate item similarities
    const allProducts = this.getAllProducts();
    const recommendations = [];
    
    allProducts.forEach(product => {
      if (!userProfile.purchasedProducts.includes(product.id)) {
        const similarity = this.calculateContentSimilarity(product, userProfile.preferences);
        if (similarity > 0.3) {
          recommendations.push({
            product_id: product.id,
            score: similarity,
            method: 'content_based'
          });
        }
      }
    });
    
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);
  }

  /**
   * Neural Collaborative Filtering (NCF)
   * Deep learning approach for user-item interaction
   */
  neuralCollaborativeFiltering(userId, productId) {
    // Simulate neural network layers
    const userEmbedding = this.getUserEmbedding(userId);
    const itemEmbedding = this.getItemEmbedding(productId);
    
    // Concatenate embeddings
    const concatenated = [...userEmbedding, ...itemEmbedding];
    
    // Forward pass through hidden layers
    let layer1 = this.denseLayer(concatenated, 128);
    layer1 = this.reluActivation(layer1);
    
    let layer2 = this.denseLayer(layer1, 64);
    layer2 = this.reluActivation(layer2);
    
    let layer3 = this.denseLayer(layer2, 32);
    layer3 = this.reluActivation(layer3);
    
    // Output layer (sigmoid for probability)
    const output = this.denseLayer(layer3, 1);
    const probability = this.sigmoidActivation(output[0]);
    
    return {
      user_id: userId,
      product_id: productId,
      interaction_probability: probability,
      confidence: probability > 0.7 ? 'high' : probability > 0.5 ? 'medium' : 'low',
      model: 'neural_collaborative_filtering'
    };
  }

  /**
   * Matrix Factorization for recommendation
   * SVD-like decomposition
   */
  matrixFactorization(userId, numFactors = 20) {
    const userItemMatrix = this.getUserItemMatrix();
    
    // Initialize factor matrices
    const userFactors = this.initializeFactors(userId, numFactors);
    const itemFactors = this.getAllItemFactors(numFactors);
    
    // Predict ratings
    const predictions = [];
    Object.keys(itemFactors).forEach(productId => {
      const predictedRating = this.dotProduct(userFactors, itemFactors[productId]);
      predictions.push({
        product_id: parseInt(productId),
        predicted_rating: Math.min(Math.max(predictedRating, 0), 5),
        confidence: 0.75
      });
    });
    
    return predictions
      .sort((a, b) => b.predicted_rating - a.predicted_rating)
      .slice(0, 10);
  }

  /**
   * Item-Item Collaborative Filtering
   * Find similar products based on user co-purchases
   */
  itemItemFiltering(productId) {
    const similarProducts = this.findSimilarProducts(productId);
    
    return similarProducts.map(product => ({
      product_id: product.id,
      similarity_score: product.similarity,
      reason: this.generateRecommendationReason(product)
    }));
  }

  // ============ Helper Methods ============

  getUserItemMatrix() {
    // Simulate user-item interaction matrix
    // In production, fetch from database
    return {
      1: { 101: 5, 102: 4, 103: 3 },
      2: { 101: 4, 104: 5, 105: 3 },
      3: { 102: 5, 103: 4, 104: 3 },
      // More users...
    };
  }

  findSimilarUsers(userId, matrix) {
    const userVector = matrix[userId] || {};
    const similarities = [];
    
    Object.keys(matrix).forEach(otherUserId => {
      if (otherUserId !== userId.toString()) {
        const similarity = this.cosineSimilarity(userVector, matrix[otherUserId]);
        if (similarity > 0.3) {
          similarities.push({
            userId: parseInt(otherUserId),
            similarity
          });
        }
      }
    });
    
    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5);
  }

  cosineSimilarity(vectorA, vectorB) {
    const keysA = Object.keys(vectorA);
    const keysB = Object.keys(vectorB);
    const commonKeys = keysA.filter(key => keysB.includes(key));
    
    if (commonKeys.length === 0) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    commonKeys.forEach(key => {
      dotProduct += vectorA[key] * vectorB[key];
    });
    
    keysA.forEach(key => normA += vectorA[key] * vectorA[key]);
    keysB.forEach(key => normB += vectorB[key] * vectorB[key]);
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  getUserProfile(userId) {
    // Simulate user profile
    return {
      purchasedProducts: [101, 102],
      preferences: {
        categories: ['electronics', 'furniture'],
        priceRange: [100, 1000],
        brands: ['BrandA', 'BrandB']
      }
    };
  }

  getAllProducts() {
    // Simulate product catalog
    return [
      { id: 103, category: 'electronics', price: 500, brand: 'BrandA' },
      { id: 104, category: 'furniture', price: 800, brand: 'BrandB' },
      { id: 105, category: 'electronics', price: 300, brand: 'BrandC' },
    ];
  }

  calculateContentSimilarity(product, preferences) {
    let score = 0;
    
    // Category match
    if (preferences.categories.includes(product.category)) {
      score += 0.5;
    }
    
    // Price range match
    if (product.price >= preferences.priceRange[0] && product.price <= preferences.priceRange[1]) {
      score += 0.3;
    }
    
    // Brand match
    if (preferences.brands.includes(product.brand)) {
      score += 0.2;
    }
    
    return score;
  }

  getUserEmbedding(userId) {
    // Simulate user embedding vector (32 dimensions)
    return Array.from({ length: 32 }, () => Math.random() * 2 - 1);
  }

  getItemEmbedding(productId) {
    // Simulate item embedding vector (32 dimensions)
    return Array.from({ length: 32 }, () => Math.random() * 2 - 1);
  }

  denseLayer(input, outputSize) {
    // Simulate dense layer
    const weights = Array.from({ length: outputSize }, () => 
      Array.from({ length: input.length }, () => Math.random() * 2 - 1)
    );
    
    return weights.map(weightRow => {
      return weightRow.reduce((sum, weight, i) => sum + weight * input[i], 0);
    });
  }

  reluActivation(vector) {
    return vector.map(val => Math.max(0, val));
  }

  sigmoidActivation(value) {
    return 1 / (1 + Math.exp(-value));
  }

  initializeFactors(userId, numFactors) {
    // Random initialization
    return Array.from({ length: numFactors }, () => Math.random());
  }

  getAllItemFactors(numFactors) {
    // Simulate item factor matrix
    const items = {};
    for (let i = 101; i <= 110; i++) {
      items[i] = Array.from({ length: numFactors }, () => Math.random());
    }
    return items;
  }

  dotProduct(vectorA, vectorB) {
    return vectorA.reduce((sum, val, i) => sum + val * vectorB[i], 0);
  }

  findSimilarProducts(productId) {
    // Simulate similar products
    return [
      { id: 201, similarity: 0.85, category: 'same_category' },
      { id: 202, similarity: 0.72, category: 'related_category' },
      { id: 203, similarity: 0.68, category: 'same_category' }
    ];
  }

  generateRecommendationReason(product) {
    if (product.similarity > 0.8) {
      return 'Highly similar to products you viewed';
    } else if (product.similarity > 0.6) {
      return 'Related to your interests';
    }
    return 'Popular among similar users';
  }
}

module.exports = new RecommendationEngine();
