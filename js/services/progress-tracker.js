/**
 * Progress Tracker
 * Manages user progress, statistics, and adaptive learning
 */

class ProgressTracker {
    constructor(db) {
        this.db = db;
        this.userId = 'default-user';
    }

    /**
     * Record a practice attempt
     * @param {string} scaleId - Scale ID
     * @param {Object} performance - Performance data
     */
    async recordPractice(scaleId, performance) {
        try {
            // Get existing progress
            const existing = await this.db.getScaleProgress(this.userId, scaleId);
            
            const stats = existing ? existing.statistics : {
                totalAttempts: 0,
                successfulAttempts: 0,
                lastAttempted: null,
                averageAccuracy: 0,
                bestAccuracy: 0,
                currentStreak: 0,
                longestStreak: 0
            };

            // Update statistics
            stats.totalAttempts++;
            if (performance.accuracy >= 75) {
                stats.successfulAttempts++;
            }
            stats.lastAttempted = new Date().toISOString();
            
            // Update accuracy
            const totalAccuracy = (stats.averageAccuracy * (stats.totalAttempts - 1)) + performance.accuracy;
            stats.averageAccuracy = totalAccuracy / stats.totalAttempts;
            stats.bestAccuracy = Math.max(stats.bestAccuracy, performance.accuracy);

            // Update progress
            await this.db.updateProgress(this.userId, scaleId, {
                statistics: stats,
                performance: performance
            });

            // Record session
            const session = {
                sessionId: Helpers.generateUUID(),
                scaleId,
                timestamp: new Date().toISOString(),
                duration: performance.duration || 0,
                accuracy: performance.accuracy,
                completed: true
            };

            await this.db.recordSession(session);

            eventBus.emit(Events.PROGRESS_UPDATED, { scaleId, stats });

            return stats;
        } catch (error) {
            console.error('Error recording practice:', error);
            throw error;
        }
    }

    /**
     * Get user statistics
     * @returns {Promise<Object>}
     */
    async getUserStatistics() {
        try {
            const allProgress = await this.db.getUserProgress(this.userId);
            const allScales = await this.db.getAllScales();

            const totalScales = allScales.length;
            const practiceScales = allProgress.length;
            const totalAttempts = allProgress.reduce((sum, p) => sum + p.statistics.totalAttempts, 0);
            const avgAccuracy = allProgress.length > 0
                ? allProgress.reduce((sum, p) => sum + p.statistics.averageAccuracy, 0) / allProgress.length
                : 0;

            return {
                totalScales,
                practiceScales,
                totalAttempts,
                averageAccuracy: Math.round(avgAccuracy),
                masteredCount: allProgress.filter(p => p.statistics.averageAccuracy >= 90).length
            };
        } catch (error) {
            console.error('Error getting statistics:', error);
            return {
                totalScales: 0,
                practiceScales: 0,
                totalAttempts: 0,
                averageAccuracy: 0,
                masteredCount: 0
            };
        }
    }

    /**
     * Get weak areas (scales needing practice)
     * @param {number} limit - Max number to return
     * @returns {Promise<Array>}
     */
    async getWeakAreas(limit = 5) {
        try {
            const allProgress = await this.db.getUserProgress(this.userId);
            
            // Sort by accuracy (lowest first)
            const weak = allProgress
                .filter(p => p.statistics.averageAccuracy < 80)
                .sort((a, b) => a.statistics.averageAccuracy - b.statistics.averageAccuracy)
                .slice(0, limit);

            // Get scale details
            const scales = await Promise.all(
                weak.map(p => this.db.getScaleById(p.scaleId))
            );

            return scales.map((scale, i) => ({
                ...scale,
                accuracy: weak[i].statistics.averageAccuracy
            }));
        } catch (error) {
            console.error('Error getting weak areas:', error);
            return [];
        }
    }
}

// Will be initialized after database is ready
let progressTracker = null;
