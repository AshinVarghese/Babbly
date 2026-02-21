import html2canvas from 'html2canvas';

export const shareService = {
    exportMemoryAsImage: async (memory, profileName = 'Baby') => {
        // 1. Create an off-screen container
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.top = '-9999px';
        container.style.left = '-9999px';
        container.style.width = '1080px'; // Square Instagram/feed size
        container.style.height = '1080px';

        // Match the memory card aesthetic
        const moodBase = memory.moodColor || '#f0f4f8';
        container.style.background = `linear-gradient(135deg, ${moodBase}22 0%, ${moodBase}05 100%)`;
        container.style.backgroundColor = '#ffffff'; // Fallback base
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.padding = '80px';
        container.style.boxSizing = 'border-box';
        container.style.fontFamily = 'Inter, system-ui, sans-serif';

        // 2. Build the HTML structure
        const dateStr = new Date(memory.timestamp).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });

        container.innerHTML = `
            <div style="flex: 1; display: flex; flex-direction: column; height: 100%; border-radius: 40px; border: 2px solid ${moodBase}44; padding: 60px; background-color: #ffffff; box-shadow: 0 20px 40px rgba(0,0,0,0.05); position: relative; overflow: hidden;">
                <!-- Decorative Mood Blob -->
                <div style="position: absolute; top: -100px; right: -100px; width: 400px; height: 400px; border-radius: 50%; background-color: ${moodBase}; opacity: 0.1; filter: blur(60px);"></div>
                
                <!-- Header -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; z-index: 1;">
                    <span style="font-size: 28px; font-weight: 700; color: #64748b; letter-spacing: 0.05em; text-transform: uppercase;">${dateStr}</span>
                    <span style="font-size: 28px; font-weight: 700; color: ${moodBase};">${profileName}</span>
                </div>

                <!-- Media -->
                ${memory.mediaRef ? `
                    <div style="width: 100%; height: 400px; border-radius: 24px; overflow: hidden; margin-bottom: 40px; z-index: 1;">
                        <img src="${memory.mediaRef}" style="width: 100%; height: 100%; object-fit: cover;" />
                    </div>
                ` : `
                    <div style="flex: 1;"></div> <!-- Spacer pushing text to center -->
                `}

                <!-- Text Content -->
                <div style="z-index: 1; ${!memory.mediaRef ? 'flex: 2; display: flex; flex-direction: column; justify-content: center;' : ''}">
                    <h2 style="font-family: serif; font-size: 64px; margin: 0 0 24px 0; color: #0f172a; line-height: 1.1;">${memory.title}</h2>
                    <p style="font-size: 32px; color: #475569; line-height: 1.5; margin: 0;">${memory.content}</p>
                </div>

                <!-- Footer Logo -->
                <div style="margin-top: auto; padding-top: 40px; text-align: center; z-index: 1;">
                    <span style="font-size: 24px; font-weight: 700; color: #94a3b8; letter-spacing: 0.1em;">BABBLY</span>
                </div>
            </div>
        `;

        document.body.appendChild(container);

        try {
            // 3. Render Canvas
            const canvas = await html2canvas(container, {
                scale: 2, // High-res export
                useCORS: true,
                backgroundColor: null
            });

            const imageBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
            const imageUrl = URL.createObjectURL(imageBlob);

            // 4. Trigger Web Share or Download
            const file = new File([imageBlob], `babbly-memory-${Date.now()}.png`, { type: 'image/png' });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: `Babbly Memory: ${memory.title}`,
                    text: memory.content,
                    files: [file]
                });
            } else {
                // Fallback to direct download
                const link = document.createElement('a');
                link.download = file.name;
                link.href = imageUrl;
                link.click();
            }

        } catch (err) {
            console.error("Failed to export memory:", err);
            alert("Could not generate shareable image.");
        } finally {
            // Cleanup
            document.body.removeChild(container);
        }
    }
};
