export const intelligenceEngine = {

    // 1. Analyze Timeline Events for Clusters & Streak Highlights
    analyzeClusters: (events) => {
        if (!events || events.length < 3) return [];

        const highlights = [];
        const sorted = [...events].sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

        // Scan for cluster feeding
        let feedClusterCount = 0;
        let feedClusterWindowStart = null;
        let feedClusterIds = [];

        for (let i = 0; i < sorted.length; i++) {
            const ev = sorted[i];
            if (ev.type === 'feed') {
                if (!feedClusterWindowStart) {
                    feedClusterWindowStart = new Date(ev.startTime);
                    feedClusterCount = 1;
                    feedClusterIds = [ev.id];
                } else {
                    const diffHours = (feedClusterWindowStart - new Date(ev.startTime)) / (1000 * 60 * 60);
                    if (diffHours <= 4) { // 4 hour window
                        feedClusterCount++;
                        feedClusterIds.push(ev.id);
                        if (feedClusterCount >= 4) {
                            highlights.push({
                                type: 'cluster_feed',
                                title: 'Cluster Feeding Active',
                                message: '4+ feeds in a short window. Totally normal growth spurt behavior!',
                                relatedIds: [...feedClusterIds],
                                insertAfterId: ev.id // Where to render the chip in the timeline
                            });
                            // Reset to prevent spamming
                            feedClusterWindowStart = null;
                            feedClusterCount = 0;
                            feedClusterIds = [];
                        }
                    } else {
                        feedClusterWindowStart = new Date(ev.startTime);
                        feedClusterCount = 1;
                        feedClusterIds = [ev.id];
                    }
                }
            }
        }

        // Scan for unusual gap (e.g. slept through the night)
        for (let i = 0; i < sorted.length - 1; i++) {
            const ev = sorted[i];
            const prev = sorted[i + 1];

            // Only compare sleep to sleep, or general "nothing happened" gaps > 8 hours
            const diffHours = (new Date(ev.startTime) - new Date(prev.startTime)) / (1000 * 60 * 60);

            if (diffHours > 8 && prev.type === 'sleep') {
                highlights.push({
                    type: 'long_sleep',
                    title: 'A Nice Long Stretch',
                    message: `Wow, ${Math.floor(diffHours)} hours since the last recorded sleep cycle.`,
                    insertAfterId: prev.id
                });
            }
        }

        return highlights;
    },

    // 2. Predict Next Action for Quick Log FAB
    predictNextActivity: (events) => {
        if (!events || events.length === 0) return null;

        const sorted = [...events].sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
        const lastEvent = sorted[0];

        // Logic: What usually follows this type of event?
        // Simple state machine: Wake -> Diaper -> Feed -> Play -> Sleep
        if (lastEvent.type === 'sleep') return { type: 'diaper', label: 'Diaper Change' };
        if (lastEvent.type === 'diaper') return { type: 'feed', label: 'Feed Time' };

        // Time based: If >3 hours since last feed, predict feed
        const lastFeed = sorted.find(e => e.type === 'feed');
        if (lastFeed) {
            const hoursSinceFeed = (new Date() - new Date(lastFeed.startTime)) / (1000 * 60 * 60);
            if (hoursSinceFeed > 3) {
                return { type: 'feed', label: 'Feed Due' };
            }
        }

        // Time based: If >2 hours since last nap (for newborn), predict sleep
        const lastSleep = sorted.find(e => e.type === 'sleep');
        if (lastSleep && lastSleep.endTime) {
            const hoursAwake = (new Date() - new Date(lastSleep.endTime)) / (1000 * 60 * 60);
            if (hoursAwake >= 2) {
                return { type: 'sleep', label: 'Nap Time' };
            }
        }

        return null; // No strong prediction
    },

    // 3. Generate end of day Daily Story Note
    generateDailyStory: (events, targetDate = new Date()) => {
        if (!events) return null;

        const targetDateString = targetDate.toDateString();
        const dailyEvents = events.filter(e => new Date(e.startTime).toDateString() === targetDateString);

        if (dailyEvents.length < 3) return null; // Not enough data

        let feedCount = 0;
        let diaperCount = 0;
        let sleepDurationMs = 0;
        let maxSleepGapMs = 0;

        dailyEvents.forEach(e => {
            if (e.type === 'feed') feedCount++;
            if (e.type === 'diaper') diaperCount++;
            if (e.type === 'sleep') {
                const duration = e.metadata?.duration || 0;
                sleepDurationMs += duration;
                if (duration > maxSleepGapMs) maxSleepGapMs = duration;
            }
        });

        const sleepHours = (sleepDurationMs / (1000 * 60 * 60)).toFixed(1);
        const maxSleepHours = (maxSleepGapMs / (1000 * 60 * 60)).toFixed(1);

        let narrative = [];

        if (feedCount > 10) narrative.push(`A busy feeding day with ${feedCount} recorded sessions.`);
        else narrative.push(`You recorded ${feedCount} feeds today.`);

        if (diaperCount >= 8) narrative.push('Lots of diaper changes!');

        if (maxSleepHours > 4) narrative.push(`We noticed a solid stretch of sleep hitting ${maxSleepHours} hours. Nice!`);
        else if (sleepHours > 0) narrative.push(`Total sleep logged was around ${sleepHours} hours.`);
        else narrative.push("No sleep recorded today.");

        narrative.push("You're doing great. See you tomorrow.");

        return {
            title: 'Daily Summary',
            body: narrative.join(' '),
            stats: { feeds: feedCount, diapers: diaperCount, sleep: sleepHours }
        };
    }
};
