import React from 'react';

const SignatureForm = ({ data, onChange, onImageUpload }) => {
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Store as local data URL - will be uploaded when copying signature
            const reader = new FileReader();
            reader.onloadend = () => {
                onImageUpload(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            <h2 style={{ marginBottom: '1.5rem' }}>Employee Details</h2>

            <div className="input-group">
                <label className="label">Full Name</label>
                <input
                    type="text"
                    name="fullName"
                    value={data.fullName}
                    onChange={onChange}
                    className="input"
                    placeholder="e.g. John Doe"
                />
            </div>

            <div className="input-group">
                <label className="label">Job Title</label>
                <input
                    type="text"
                    name="title"
                    value={data.title}
                    onChange={onChange}
                    className="input"
                    placeholder="e.g. Sales Representative"
                />
            </div>

            <div className="input-group">
                <label className="label">Email Address</label>
                <input
                    type="email"
                    name="email"
                    value={data.email}
                    onChange={onChange}
                    className="input"
                    placeholder="john@example.com"
                />
            </div>

            <div className="input-group">
                <label className="label">Phone Number</label>
                <input
                    type="tel"
                    name="phone"
                    value={data.phone}
                    onChange={onChange}
                    className="input"
                    placeholder="555-0123"
                />
            </div>

            <div className="input-group">
                <label className="label">Website</label>
                <input
                    type="text"
                    name="website"
                    value={data.website}
                    onChange={onChange}
                    className="input"
                    placeholder="www.medleadconvert.com"
                />
            </div>

            <div className="input-group">
                <label className="label">Address</label>
                <input
                    type="text"
                    name="address"
                    value={data.address}
                    onChange={onChange}
                    className="input"
                    placeholder="123 Medical Plaza"
                />
            </div>

            <h3 style={{ margin: '2rem 0 1rem' }}>Media</h3>

            <div className="input-group">
                <label className="label">Logo Selection</label>
                <select
                    name="logo"
                    value={data.logo}
                    onChange={onChange}
                    className="input"
                >
                    <option value="primary">Primary Logo</option>
                    <option value="secondary">Secondary Logo</option>
                    <option value="none">No Logo</option>
                </select>
            </div>

            <div className="input-group">
                <label className="label">Headshot</label>
                
                <div style={{ marginTop: '0.5rem' }}>
                    <label className="label">Headshot Type</label>
                    <select
                        name="headshotType"
                        value={data.headshotType || 'upload'}
                        onChange={(e) => {
                            onChange(e);
                            // If switching to logo, set the pre-rendered logo URL
                            if (e.target.value === 'logo') {
                                onImageUpload('https://res.cloudinary.com/da2gi6rwv/image/upload/v1764966256/lcqxq8smdn39ds6mjvwj.png');
                            } else if (e.target.value === 'upload' && data.headshotUrl?.includes('cloudinary')) {
                                // Clear the logo URL if switching back to upload
                                onImageUpload('');
                            }
                        }}
                        className="input"
                    >
                        <option value="upload">Upload Photo</option>
                        <option value="logo">MedLead Logo</option>
                    </select>
                </div>

                {data.headshotType !== 'logo' && (
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.5rem' }}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="input"
                            style={{ flex: 1 }}
                        />
                    </div>
                )}

                <div style={{ marginTop: '0.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            name="showHeadshot"
                            checked={data.showHeadshot}
                            onChange={onChange}
                        />
                        <span className="label" style={{ marginBottom: 0 }}>Show Headshot</span>
                    </label>
                </div>
                {data.headshotUrl && (
                    <div style={{ marginTop: '1rem' }}>
                        <p className="label">Preview:</p>
                        <img src={data.headshotUrl} alt="Headshot Preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '50%' }} />

                        {/* Only show adjustment controls for uploaded photos, not for MedLead logo */}
                        {data.headshotType !== 'logo' && (
                            <>
                                <div style={{ marginTop: '1rem' }}>
                                    <label className="label">Image Scale ({data.headshotImageScale}%)</label>
                                    <input
                                        type="range"
                                        name="headshotImageScale"
                                        min="100"
                                        max="300"
                                        value={data.headshotImageScale}
                                        onChange={onChange}
                                        className="input"
                                    />
                                </div>

                                <div style={{ marginTop: '1rem' }}>
                                    <label className="label">Shape</label>
                                    <select
                                        name="headshotShape"
                                        value={data.headshotShape}
                                        onChange={onChange}
                                        className="input"
                                    >
                                        <option value="circle">Circle</option>
                                        <option value="rounded">Rounded Corners</option>
                                        <option value="square">Square</option>
                                    </select>
                                </div>

                                <div style={{ marginTop: '1rem' }}>
                                    <label className="label">Position X ({data.headshotX}%)</label>
                                    <input
                                        type="range"
                                        name="headshotX"
                                        min="0"
                                        max="100"
                                        value={data.headshotX}
                                        onChange={onChange}
                                        className="input"
                                    />
                                </div>

                                <div style={{ marginTop: '1rem' }}>
                                    <label className="label">Position Y ({data.headshotY}%)</label>
                                    <input
                                        type="range"
                                        name="headshotY"
                                        min="0"
                                        max="100"
                                        value={data.headshotY}
                                        onChange={onChange}
                                        className="input"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SignatureForm;
