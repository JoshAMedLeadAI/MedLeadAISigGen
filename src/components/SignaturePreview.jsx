import React, { useRef } from 'react';

const SignaturePreview = ({ data }) => {
    const signatureRef = useRef(null);

    const getLogoSrc = () => {
        if (data.logo === 'primary') return '/assets/logo1.png'; // Assuming this path
        if (data.logo === 'secondary') return '/assets/logo2.png';
        return null;
    };

    const logoSrc = getLogoSrc();

    const copyToClipboard = () => {
        if (!signatureRef.current) return;

        // We need to copy the HTML content
        const html = signatureRef.current.innerHTML;

        // Use the Clipboard API to write HTML
        const blob = new Blob([html], { type: 'text/html' });
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

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2>Preview</h2>
                <button className="btn btn-primary" onClick={copyToClipboard}>
                    Copy Signature
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
                                                            src={window.location.origin + logoSrc} // Use absolute URL for preview, but might need hosting for real email
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
                                                    {data.address && (
                                                        <div>
                                                            <span style={{ color: '#06b6d4', fontWeight: 'bold' }}>A:</span> {data.address}
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Note: Images (logos/headshots) must be hosted publicly to appear in emails sent to others.
                For now, local uploads work for the preview and copy, but might break in recipients' inboxes if not hosted.
            </p>
        </div>
    );
};

export default SignaturePreview;
