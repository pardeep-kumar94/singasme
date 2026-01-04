"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { db, getAnalyticsInstance } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { logEvent } from "firebase/analytics";

export default function Home() {
  const [activeStep, setActiveStep] = useState(1);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackComment, setFeedbackComment] = useState("");

  // Initialize Firebase Analytics
  useEffect(() => {
    const initAnalytics = async () => {
      const analyticsInstance = await getAnalyticsInstance();
      setAnalytics(analyticsInstance);

      // Log page view
      if (analyticsInstance) {
        logEvent(analyticsInstance, 'page_view', {
          page_title: 'Harmonize Landing Page',
          page_location: window.location.href,
          page_path: window.location.pathname,
        });
      }
    };

    initAnalytics();
  }, []);

  // Handle waitlist submission
  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Add email to Firestore
      await addDoc(collection(db, "waitlist"), {
        email: email,
        timestamp: serverTimestamp(),
        source: "landing_page",
      });

      // Log analytics event
      if (analytics) {
        logEvent(analytics, 'join_waitlist', {
          email: email,
          method: 'email_form',
        });
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error("Error adding email to waitlist:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle feedback submission
  const handleFeedbackSubmit = async () => {
    if (!selectedRating) return;

    try {
      // Add feedback to Firestore
      await addDoc(collection(db, "feedback"), {
        rating: selectedRating,
        comment: feedbackComment || null,
        timestamp: serverTimestamp(),
        source: "landing_page",
      });

      // Log analytics event
      if (analytics) {
        logEvent(analytics, 'submit_feedback', {
          rating: selectedRating,
          has_comment: feedbackComment.length > 0,
        });
      }

      setFeedbackSubmitted(true);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <main className="min-h-screen">
      {/* SEO - Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "SingAs me",
            "applicationCategory": "MultimediaApplication",
            "operatingSystem": "Web",
            "description": "AI-powered voice cloning technology that transforms any song into your unique voice. Clone your voice in minutes and apply it to any MP3 file with studio-quality results.",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "availability": "https://schema.org/PreOrder"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "127"
            },
            "featureList": [
              "AI Voice Cloning",
              "MP3 Voice Transformation",
              "Studio-Quality Audio Output",
              "Fast Voice Processing",
              "Secure Voice Data"
            ]
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "SingAs me",
            "url": "https://singasme.ai",
            "logo": "https://singasme.ai/logo.png",
            "sameAs": [
              "https://twitter.com/singasme",
              "https://linkedin.com/company/singasme",
              "https://instagram.com/singasme"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "Customer Support",
              "email": "support@singasme.ai"
            }
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is AI voice cloning?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "AI voice cloning is a technology that uses artificial intelligence to create a digital replica of your voice. With SingAs me, you can clone your voice in minutes and use it to transform any song or audio file."
                }
              },
              {
                "@type": "Question",
                "name": "How does SingAs me work?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "SingAs me works in three simple steps: 1) Clone your voice by uploading audio samples, 2) Upload any MP3 song you want to transform, 3) Download your transformed audio with your cloned voice singing the song."
                }
              },
              {
                "@type": "Question",
                "name": "Is voice cloning secure?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, SingAs me uses enterprise-grade security to protect your voice data. All voice clones are encrypted and stored securely, and you have full control over your voice data."
                }
              }
            ]
          })
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h1 className="font-heading text-2xl font-bold text-black">SingAs me</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setShowWaitlistModal(true);
                  if (analytics) {
                    logEvent(analytics, 'click_join_waitlist', {
                      location: 'navigation',
                    });
                  }
                }}
                className="bg-black text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-all hover:shadow-lg font-medium"
              >
                Join Waitlist
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto pt-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-1.5 rounded-full text-sm mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              AI-Powered Voice Technology
            </div>

            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold text-black mb-6 leading-tight">
              AI Voice Cloning:<br />
              <span className="relative inline-block">
                Transform Any Song Into Your Voice
                <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 300 12" fill="none">
                  <path d="M2 10C50 5 150 2 298 10" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Experience the power of AI voice synthesis. Create your AI voice clone in minutes with our advanced voice cloning technology. Upload any MP3 and hear yourself singing your favorite songs with studio-quality, realistic results. Join thousands discovering the future of voice AI.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={() => {
                  setShowWaitlistModal(true);
                  if (analytics) {
                    logEvent(analytics, 'click_join_waitlist', {
                      location: 'hero',
                    });
                  }
                }}
                className="group bg-black text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-gray-800 transition-all hover:scale-105 shadow-xl flex items-center justify-center gap-2"
              >
                Join Waitlist
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <Link
                href="#demo"
                className="bg-white text-black px-8 py-4 rounded-xl text-lg font-medium hover:bg-gray-50 transition-all border-2 border-gray-200 hover:border-black flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Watch Demo
              </Link>
            </div>

            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Be the first to try
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Early access perks
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Demo Section */}
      <section id="demo" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 md:p-12 shadow-2xl">
            <div className="grid md:grid-cols-3 gap-6 items-center">
              {/* Step 1 */}
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <h4 className="font-heading text-lg font-bold text-white mb-2">Your Voice</h4>
                  <p className="text-gray-300 text-sm">Upload audio sample</p>
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex justify-center">
                <svg className="w-12 h-12 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                  <h4 className="font-heading text-lg font-bold text-white mb-2">Any Song</h4>
                  <p className="text-gray-300 text-sm">Upload MP3 file</p>
                </div>
              </div>
            </div>

            {/* Result */}
            <div className="mt-8 flex justify-center">
              <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h5 className="font-heading font-bold text-black mb-1">Your Transformed Song</h5>
                      <p className="text-sm text-gray-600">Ready to download</p>
                    </div>
                    <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Interactive */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50" aria-labelledby="how-it-works">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 id="how-it-works" className="font-heading text-4xl sm:text-5xl font-bold text-black mb-4">
              How AI Voice Cloning Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to clone your voice and transform any song with AI voice synthesis technology
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 Card */}
            <div
              onMouseEnter={() => setActiveStep(1)}
              className={`bg-white rounded-2xl p-8 border-2 transition-all cursor-pointer ${
                activeStep === 1 ? 'border-black shadow-2xl scale-105' : 'border-gray-200 shadow-lg'
              }`}
            >
              <div className="mb-6">
                <span className="bg-black text-white font-heading text-2xl font-bold w-12 h-12 rounded-full flex items-center justify-center">
                  1
                </span>
              </div>
              <div className="mb-6">
                <div className="w-full h-48 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm text-gray-500 font-medium">Upload your voice</p>
                  </div>
                </div>
              </div>
              <h4 className="font-heading text-2xl font-bold mb-3 text-black">Clone Your Voice</h4>
              <p className="text-gray-600 leading-relaxed mb-4">
                Record or upload 30 seconds of your voice. Our AI analyzes your unique vocal characteristics.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  30 seconds minimum
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Clear audio required
                </li>
              </ul>
            </div>

            {/* Step 2 Card */}
            <div
              onMouseEnter={() => setActiveStep(2)}
              className={`bg-white rounded-2xl p-8 border-2 transition-all cursor-pointer ${
                activeStep === 2 ? 'border-black shadow-2xl scale-105' : 'border-gray-200 shadow-lg'
              }`}
            >
              <div className="mb-6">
                <span className="bg-black text-white font-heading text-2xl font-bold w-12 h-12 rounded-full flex items-center justify-center">
                  2
                </span>
              </div>
              <div className="mb-6">
                <div className="w-full h-48 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                    <p className="text-sm text-gray-500 font-medium">Select a song</p>
                  </div>
                </div>
              </div>
              <h4 className="font-heading text-2xl font-bold mb-3 text-black">Upload Any Song</h4>
              <p className="text-gray-600 leading-relaxed mb-4">
                Choose any MP3 file. Our AI will transform the vocals into your cloned voice.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Any MP3 format
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Up to 10 minutes
                </li>
              </ul>
            </div>

            {/* Step 3 Card */}
            <div
              onMouseEnter={() => setActiveStep(3)}
              className={`bg-white rounded-2xl p-8 border-2 transition-all cursor-pointer ${
                activeStep === 3 ? 'border-black shadow-2xl scale-105' : 'border-gray-200 shadow-lg'
              }`}
            >
              <div className="mb-6">
                <span className="bg-black text-white font-heading text-2xl font-bold w-12 h-12 rounded-full flex items-center justify-center">
                  3
                </span>
              </div>
              <div className="mb-6">
                <div className="w-full h-48 bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex items-center justify-center border-2 border-green-200">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm text-green-700 font-medium">Processing complete!</p>
                  </div>
                </div>
              </div>
              <h4 className="font-heading text-2xl font-bold mb-3 text-black">Download & Share</h4>
              <p className="text-gray-600 leading-relaxed mb-4">
                Get your transformed song in seconds. Download in high quality and share anywhere.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Studio quality output
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Ready in 30 seconds
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white" aria-labelledby="features">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 id="features" className="font-heading text-4xl sm:text-5xl font-bold text-black mb-4">
              Why Choose SingAs me for AI Voice Cloning
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional-grade AI voice synthesis technology with studio-quality results, designed for content creators, musicians, and voice AI enthusiasts
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-black transition-all group">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-heading text-lg font-bold mb-2 text-black">Lightning Fast</h4>
              <p className="text-gray-600 text-sm">Transform songs in under 30 seconds with our optimized AI engine</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-black transition-all group">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-heading text-lg font-bold mb-2 text-black">Studio Quality</h4>
              <p className="text-gray-600 text-sm">Professional-grade output with crystal clear audio fidelity</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-black transition-all group">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="font-heading text-lg font-bold mb-2 text-black">Secure & Private</h4>
              <p className="text-gray-600 text-sm">Your voice data is encrypted and never shared with third parties</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-black transition-all group">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="font-heading text-lg font-bold mb-2 text-black">Easy to Use</h4>
              <p className="text-gray-600 text-sm">Intuitive interface designed for everyone, no technical skills needed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          {!feedbackSubmitted ? (
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border-2 border-gray-200">
              <div className="text-center mb-8">
                <h3 className="font-heading text-3xl sm:text-4xl font-bold text-black mb-3">
                  What do you think?
                </h3>
                <p className="text-lg text-gray-600">
                  Help us shape the future of SingAs me. Rate this idea!
                </p>
              </div>

              {/* Rating Stars */}
              <div className="flex justify-center gap-3 mb-8">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setSelectedRating(rating)}
                    className="group transition-transform hover:scale-110"
                  >
                    <svg
                      className={`w-12 h-12 md:w-16 md:h-16 transition-colors ${
                        selectedRating && rating <= selectedRating
                          ? 'text-yellow-400'
                          : 'text-gray-300 group-hover:text-yellow-200'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>

              {/* Rating Labels */}
              <div className="flex justify-between text-sm text-gray-500 mb-8 max-w-md mx-auto">
                <span>Not interested</span>
                <span>Love it!</span>
              </div>

              {/* Optional Comment */}
              {selectedRating && (
                <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
                  <label htmlFor="feedback-comment" className="block text-sm font-medium text-gray-700 mb-2">
                    Any thoughts to share? (Optional)
                  </label>
                  <textarea
                    id="feedback-comment"
                    rows={3}
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    placeholder="Tell us what excites you or what could be better..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors resize-none"
                  />
                </div>
              )}

              {/* Submit Button */}
              {selectedRating && (
                <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <button
                    onClick={handleFeedbackSubmit}
                    className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-all hover:scale-105 shadow-lg"
                  >
                    Submit Feedback
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 shadow-xl border-2 border-green-200 text-center animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-heading text-3xl font-bold text-black mb-3">
                Thank you for your feedback!
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Your input helps us build a better product. We appreciate you taking the time to share your thoughts!
              </p>
              <div className="flex items-center justify-center gap-2 text-yellow-400">
                {[...Array(selectedRating)].map((_, i) => (
                  <svg key={i} className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h3 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Be Among the First<br />to Experience SingAs me
          </h3>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto">
            Join our exclusive waitlist and get early access to the future of AI voice technology. Limited spots available.
          </p>

          <button
            onClick={() => {
              setShowWaitlistModal(true);
              if (analytics) {
                logEvent(analytics, 'click_join_waitlist', {
                  location: 'final_cta',
                });
              }
            }}
            className="inline-flex items-center gap-3 bg-white text-black px-10 py-5 rounded-xl text-lg font-bold hover:bg-gray-100 transition-all hover:scale-105 shadow-2xl group"
          >
            Join the Waitlist
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>

          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Early access
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Exclusive perks
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Priority support
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h5 className="font-heading text-xl font-bold text-black">SingAs me</h5>
            </div>
            <p className="text-gray-600 text-sm">&copy; 2026 SingAs me. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-black hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-black hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-black hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Waitlist Modal */}
      {showWaitlistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            {/* Close button */}
            <button
              onClick={() => {
                setShowWaitlistModal(false);
                setIsSubmitted(false);
                setEmail("");
              }}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {!isSubmitted ? (
              <>
                {/* Modal Header */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                  <h3 className="font-heading text-3xl font-bold text-black mb-2">
                    Join the Waitlist
                  </h3>
                  <p className="text-gray-600">
                    Be among the first to experience AI voice cloning. Get early access and exclusive perks.
                  </p>
                </div>

                {/* Email Form */}
                <form
                  onSubmit={handleWaitlistSubmit}
                  className="space-y-4"
                >
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email address
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 group disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Joining...
                      </>
                    ) : (
                      <>
                        Join Waitlist
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>

                {/* Benefits */}
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                  <p className="text-sm font-medium text-gray-700 mb-3">What you&apos;ll get:</p>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-600">Priority access when we launch</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-600">Exclusive discount for early members</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-600">Updates on our launch progress</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Success State */}
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-heading text-3xl font-bold text-black mb-3">
                    You&apos;re on the list!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Thanks for joining! We&apos;ll send you an email at <span className="font-medium text-black">{email}</span> with updates and early access details.
                  </p>
                  <button
                    onClick={() => {
                      setShowWaitlistModal(false);
                      setIsSubmitted(false);
                      setEmail("");
                    }}
                    className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
