import React, { useState } from 'react';
import { Upload, AlertCircle, CheckCircle, Loader } from 'lucide-react';

interface ATSResult {
  atsScore: number;
  isResume: boolean;
  analysis: string;
  performance?: {
    technical: number;
    aptitude: number;
    communication: number;
  };
  profileScore?: number;
  error?: string;
}

const colors = {
  primary: '#3b82f6',
  secondary: '#6b7280',
  border: '#e5e7eb',
  cardBg: '#ffffff',
  success: '#16a34a',
  error: '#dc2626',
  warning: '#f59e0b',
  textPrimary: '#1f2937',
};

const ATSResumeScorer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ATSResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf' || selectedFile.type === 'text/plain') {
        setFile(selectedFile);
        setError(null);
        setResult(null);
      } else {
        setError('Please upload a PDF or text file only');
        setFile(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch('/api/analyze/resume-ats', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to analyze resume');
        setResult(data as ATSResult);
        return;
      }

      setResult(data as ATSResult);
    } catch (err) {
      setError('Error uploading file. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
      <div className="card">
        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: colors.textPrimary }}>
          <Upload size={24} />
          ATS Resume Analyzer
        </h2>

        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <div
            style={{
              border: `2px dashed ${colors.primary}`,
              borderRadius: '8px',
              padding: '2rem',
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: 'rgba(59, 130, 246, 0.05)',
              transition: 'all 0.3s ease',
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
            }}
            onDragLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
            }}
            onDrop={(e) => {
              e.preventDefault();
              const droppedFile = e.dataTransfer.files?.[0];
              if (droppedFile) {
                if (droppedFile.type === 'application/pdf' || droppedFile.type === 'text/plain') {
                  setFile(droppedFile);
                  setError(null);
                } else {
                  setError('Please upload a PDF or text file only');
                }
              }
            }}
          >
            <input
              type="file"
              accept=".pdf,.txt"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="resume-input"
              disabled={loading}
            />
            <label htmlFor="resume-input" style={{ cursor: 'pointer', display: 'block' }}>
              <p style={{ marginBottom: '0.5rem', fontWeight: 'bold', color: colors.textPrimary }}>
                Drag and drop your resume here or click to select
              </p>
              <p style={{ color: colors.secondary, fontSize: '0.9rem' }}>
                Supported formats: PDF, TXT
              </p>
              {file && (
                <p style={{ marginTop: '1rem', color: colors.primary, fontWeight: '500' }}>
                  ✓ {file.name}
                </p>
              )}
            </label>
          </div>

          <button
            type="submit"
            disabled={!file || loading}
            style={{
              marginTop: '1rem',
              width: '100%',
              padding: '0.75rem',
              backgroundColor: file && !loading ? colors.primary : colors.border,
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: file && !loading ? 'pointer' : 'not-allowed',
              fontSize: '1rem',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              opacity: file && !loading ? 1 : 0.6,
            }}
          >
            {loading && <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />}
            {loading ? 'Analyzing...' : 'Analyze Resume'}
          </button>
        </form>

        {error && (
          <div
            style={{
              padding: '1rem',
              backgroundColor: '#fee2e2',
              border: `1px solid ${colors.error}40`,
              borderRadius: '6px',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'center',
              marginBottom: '1rem',
              color: colors.textPrimary,
            }}
          >
            <AlertCircle size={20} style={{ color: colors.error, flexShrink: 0 }} />
            <div>
              <p style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>Invalid Resume</p>
              <p style={{ color: colors.secondary }}>{error}</p>
            </div>
          </div>
        )}

        {result && result.isResume && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div
              style={{
                padding: '1.5rem',
                backgroundColor: '#ecfdf5',
                border: `1px solid ${colors.success}40`,
                borderRadius: '6px',
                marginBottom: '1.5rem',
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'flex-start',
              }}
            >
              <CheckCircle size={20} style={{ color: colors.success, flexShrink: 0, marginTop: '0.25rem' }} />
              <div>
                <p style={{ fontWeight: 'bold', color: colors.success, marginBottom: '0.5rem' }}>
                  ✓ Valid Resume Detected
                </p>
                <p style={{ color: colors.secondary }}>
                  Your resume has been successfully validated and analyzed.
                </p>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '1.5rem',
              }}
            >
              {/* ATS Score */}
              <div
                style={{
                  padding: '1.5rem',
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '8px',
                  textAlign: 'center',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
              >
                <p style={{ color: colors.secondary, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  ATS Score
                </p>
                <p
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    color: result.atsScore >= 70 ? colors.success : result.atsScore >= 50 ? colors.warning : colors.error,
                  }}
                >
                  {result.atsScore}/100
                </p>
                <p style={{ fontSize: '0.8rem', color: colors.secondary, marginTop: '0.5rem' }}>
                  {result.atsScore >= 70 ? '✓ Excellent' : result.atsScore >= 50 ? '△ Good' : '✗ Needs Improvement'}
                </p>
              </div>

              {/* Performance Metrics */}
              {result.performance && (
                <>
                  <div
                    style={{
                      padding: '1.5rem',
                      backgroundColor: colors.cardBg,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '8px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    }}
                  >
                    <p style={{ color: colors.secondary, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                      Technical Skills
                    </p>
                    <div
                      style={{
                        fontSize: '1.8rem',
                        fontWeight: 'bold',
                        marginBottom: '0.5rem',
                        color: colors.primary,
                      }}
                    >
                      {result.performance.technical}%
                    </div>
                    <div
                      style={{
                        height: '6px',
                        backgroundColor: colors.border,
                        borderRadius: '3px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${result.performance.technical}%`,
                          backgroundColor: colors.primary,
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '1.5rem',
                      backgroundColor: colors.cardBg,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '8px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    }}
                  >
                    <p style={{ color: colors.secondary, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                      Communication
                    </p>
                    <div
                      style={{
                        fontSize: '1.8rem',
                        fontWeight: 'bold',
                        marginBottom: '0.5rem',
                        color: colors.primary,
                      }}
                    >
                      {result.performance.communication}%
                    </div>
                    <div
                      style={{
                        height: '6px',
                        backgroundColor: colors.border,
                        borderRadius: '3px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${result.performance.communication}%`,
                          backgroundColor: colors.primary,
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '1.5rem',
                      backgroundColor: colors.cardBg,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '8px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    }}
                  >
                    <p style={{ color: colors.secondary, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                      Problem Solving
                    </p>
                    <div
                      style={{
                        fontSize: '1.8rem',
                        fontWeight: 'bold',
                        marginBottom: '0.5rem',
                        color: colors.primary,
                      }}
                    >
                      {result.performance.aptitude}%
                    </div>
                    <div
                      style={{
                        height: '6px',
                        backgroundColor: colors.border,
                        borderRadius: '3px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${result.performance.aptitude}%`,
                          backgroundColor: colors.primary,
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Analysis */}
            {result.analysis && (
              <div
                style={{
                  padding: '1.5rem',
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '8px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
              >
                <h3 style={{ marginBottom: '1rem', color: colors.textPrimary }}>Detailed Analysis</h3>
                <div
                  style={{
                    color: colors.secondary,
                    lineHeight: '1.6',
                    fontSize: '0.95rem',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {result.analysis}
                </div>
              </div>
            )}
          </div>
        )}

        <style>{`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default ATSResumeScorer;
