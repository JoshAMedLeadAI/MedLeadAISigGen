import React, { useRef, useState } from 'react';
import { renderHeadshotToCanvas, uploadBlob } from '../utils/upload';

const SignaturePreview = ({ data }) => {
    const signatureRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);

    const getLogoSrc = () => {
        if (data.logo === 'primary') return 'https://res.cloudinary.com/da2gi6rwv/image/upload/v1763908562/MEDLEAD_Logo_Full_jdjdkg.png';
        if (data.logo === 'secondary') return 'https://res.cloudinary.com/da2gi6rwv/image/upload/v1763908534/MedLead_Logo_Symbol_h8pjlx.png';
        return null;
    };

    const logoSrc = getLogoSrc();

    const copyToClipboard = async () => {
        if (!signatureRef.current) return;

        let finalHeadshotUrl = null;

        // If there's a headshot to process, render it to canvas and upload
        if (data.showHeadshot && data.headshotUrl) {
            setIsUploading(true);
            try {
                // Render the headshot with all transformations baked in
                const blob = await renderHeadshotToCanvas(data.headshotUrl, {
                    containerSize: data.headshotContainerSize,
                    imageScale: data.headshotImageScale,
                    positionX: data.headshotX,
                    positionY: data.headshotY,
                    shape: data.headshotShape
                });

                // Upload the rendered PNG to Cloudinary
                finalHeadshotUrl = await uploadBlob(blob);
            } catch (error) {
                console.error('Failed to process headshot:', error);
                alert('Failed to upload headshot. Please try again.');
                setIsUploading(false);
                return;
            }
            setIsUploading(false);
        }

        // Generate the final HTML with the Cloudinary URL
        const signatureHtml = generateSignatureHtml(finalHeadshotUrl);

        // Use the Clipboard API to write HTML
        const blob = new Blob([signatureHtml], { type: 'text/html' });
        const textBlob = new Blob([signatureRef.current.innerText], { type: 'text/plain' });

        const item = new ClipboardItem({
            'text/html': blob,
            'text/plain': textBlob
        });

        navigator.clipboard.write([item]).then(() => {
            alert('Signature copied to clipboard! Paste it into Gmail settings.');
        }).catch(err => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy. Please try selecting and copying manually.');
        });
    };

    // Generate signature HTML with simple img tag for headshot (no CSS positioning)
    const generateSignatureHtml = (headshotUrl) => {
        const headshotHtml = headshotUrl ? `
            <td style="padding-right: 20px; vertical-align: top;">
                <img src="${headshotUrl}" alt="${data.fullName}" style="width: ${data.headshotContainerSize}px; height: ${data.headshotContainerSize}px; display: block; ${data.headshotShape === 'circle' ? 'border-radius: 50%;' : data.headshotShape === 'rounded' ? 'border-radius: 10px;' : ''}" />
            </td>
        ` : '';

        const showDivider = data.showHeadshot && headshotUrl;

        return `
            <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif; color: #333; line-height: 1.4;">
                <tbody>
                    <tr>
                        ${headshotHtml}
                        <td style="vertical-align: top; ${showDivider ? 'border-left: 2px solid #06b6d4; padding-left: 20px;' : ''}">
                            <table cellpadding="0" cellspacing="0" border="0">
                                <tbody>
                                    <tr>
                                        <td style="padding-bottom: 5px;">
                                            <strong style="font-size: 18px; color: #0f172a; display: block;">${data.fullName}</strong>
                                            <span style="font-size: 14px; color: #06b6d4; font-weight: bold; text-transform: uppercase;">${data.title}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding-bottom: 15px;">
                                            ${logoSrc ? `<img src="${logoSrc}" alt="MedLead Convert" style="height: 30px; display: block;" />` : ''}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="font-size: 13px; color: #64748b;">
                                            ${data.phone ? `<div style="margin-bottom: 2px;"><span style="color: #06b6d4; font-weight: bold;">P:</span> <a href="tel:${data.phone}" style="color: #64748b; text-decoration: none;">${data.phone}</a></div>` : ''}
                                            ${data.email ? `<div style="margin-bottom: 2px;"><span style="color: #06b6d4; font-weight: bold;">E:</span> <a href="mailto:${data.email}" style="color: #64748b; text-decoration: none;">${data.email}</a></div>` : ''}
                                            ${data.website ? `<div style="margin-bottom: 2px;"><span style="color: #06b6d4; font-weight: bold;">W:</span> <a href="https://${data.website}" style="color: #64748b; text-decoration: none;">${data.website}</a></div>` : ''}
                                            ${data.address ? `<div><span style="color: #06b6d4; font-weight: bold;">A:</span> ${data.address}</div>` : ''}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        `;
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2>Preview</h2>
                <button 
                    className="btn btn-primary" 
                    onClick={copyToClipboard}
                    disabled={isUploading}
                >
                    {isUploading ? 'Processing...' : 'Copy Signature'}
                </button>
            </div>

            <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '4px',
                overflowX: 'auto'
            }}>
                {/* This div contains the actual signature to be copied */}
                <div ref={signatureRef} style={{ fontFamily: 'Arial, sans-serif', color: '#333', lineHeight: '1.4' }}>
                    <table cellPadding="0" cellSpacing="0" border="0" style={{ borderCollapse: 'collapse' }}>
                        <tbody>
                            <tr>
                                {/* Headshot Column */}
                                {data.showHeadshot && data.headshotUrl && (
                                    <td style={{ paddingRight: '20px', verticalAlign: 'top' }}>
                                        <div style={{
                                            width: `${data.headshotContainerSize}px`,
                                            height: `${data.headshotContainerSize}px`,
                                            overflow: 'hidden',
                                            borderRadius: data.headshotShape === 'circle' ? '50%' : data.headshotShape === 'rounded' ? '10px' : '0',
                                            position: 'relative',
                                            display: 'inline-block',
                                            textAlign: 'center',
                                            verticalAlign: 'middle'
                                        }}>
                                            <img
                                                src={data.headshotUrl}
                                                alt={data.fullName}
                                                style={{
                                                    width: `${data.headshotImageScale}%`,
                                                    height: 'auto',
                                                    maxWidth: 'none',
                                                    position: 'relative',
                                                    left: `${(data.headshotX - 50) * 5}px`,
                                                    top: `${(data.headshotY - 50) * 5}px`,
                                                    display: 'inline-block'
                                                }}
                                            />
                                        </div>
                                    </td>
                                )}

                                {/* Info Column */}
                                <td style={{ verticalAlign: 'top', borderLeft: data.showHeadshot && data.headshotUrl ? '2px solid #06b6d4' : 'none', paddingLeft: data.showHeadshot && data.headshotUrl ? '20px' : '0' }}>
                                    <table cellPadding="0" cellSpacing="0" border="0">
                                        <tbody>
                                            <tr>
                                                <td style={{ paddingBottom: '5px' }}>
                                                    <strong style={{ fontSize: '18px', color: '#0f172a', display: 'block' }}>{data.fullName}</strong>
                                                    <span style={{ fontSize: '14px', color: '#06b6d4', fontWeight: 'bold', textTransform: 'uppercase' }}>{data.title}</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style={{ paddingBottom: '15px' }}>
                                                    {logoSrc && (
                                                        <img
                                                            src={logoSrc}
                                                            alt="MedLead Convert"
                                                            style={{ height: '30px', display: 'block' }}
                                                        />
                                                    )}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style={{ fontSize: '13px', color: '#64748b' }}>
                                                    {data.phone && (
                                                        <div style={{ marginBottom: '2px' }}>
                                                            <span style={{ color: '#06b6d4', fontWeight: 'bold' }}>P:</span> <a href={`tel:${data.phone}`} style={{ color: '#64748b', textDecoration: 'none' }}>{data.phone}</a>
                                                        </div>
                                                    )}
                                                    {data.email && (
                                                        <div style={{ marginBottom: '2px' }}>
                                                            <span style={{ color: '#06b6d4', fontWeight: 'bold' }}>E:</span> <a href={`mailto:${data.email}`} style={{ color: '#64748b', textDecoration: 'none' }}>{data.email}</a>
                                                        </div>
                                                    )}
                                                    {data.website && (
                                                        <div style={{ marginBottom: '2px' }}>
                                                            <span style={{ color: '#06b6d4', fontWeight: 'bold' }}>W:</span> <a href={`https://${data.website}`} style={{ color: '#64748b', textDecoration: 'none' }}>{data.website}</a>
                                                        </div>
                                                    )}
                                                    {
                                                        data.address && (
                                                            <div>
                                                                <span style={{ color: '#06b6d4', fontWeight: 'bold' }}>A:</span> {data.address}
                                                            </div>
                                                        )
                                                    }
                                                </td>
                                            </tr >
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table >
                </div>
            </div>
            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Note: When you click "Copy Signature", your headshot will be rendered with all adjustments 
                baked in and uploaded to the cloud. This ensures it displays correctly in Gmail.
            </p>
        </div>
    );
};

export default SignaturePreview;
