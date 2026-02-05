// Open Graph image - Social media preview image
import { ImageResponse } from 'next/og';

export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default function OgImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 60,
                    background: 'linear-gradient(to right, #6366f1, #8b5cf6)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                }}
            >
                WorkflowOS - AI-Powered Automation
            </div>
        ),
        { ...size }
    );
}
