'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Calendar, Clock, DollarSign, Users, MapPin, Loader2 } from 'lucide-react';
import { Class, ClassSchedule } from '@/types/database';
import { format } from 'date-fns';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function ClassDetailPage() {
  const params = useParams();
  const router = useRouter();
  const classId = params.id as string;
  
  const [classItem, setClassItem] = useState<Class | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    fetchClass();
  }, [classId]);

  const fetchClass = async () => {
    try {
      const response = await fetch(`/api/classes/${classId}`);
      const data = await response.json();
      setClassItem(data.class);
    } catch (error) {
      console.error('Failed to fetch class:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    if (!selectedSchedule) {
      alert('Please select a class schedule');
      return;
    }

    setProcessing(true);

    try {
      // Create Stripe checkout session
      const response = await fetch('/api/payments/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId: classItem?.id,
          scheduleId: selectedSchedule,
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (data.sessionId) {
        const stripe = await stripePromise;
        if (stripe) {
          await stripe.redirectToCheckout({ sessionId: data.sessionId });
        }
      } else {
        throw new Error(data.error || 'Failed to create payment session');
      }
    } catch (error: any) {
      alert('Failed to start checkout: ' + error.message);
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!classItem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Class not found</h1>
          <button
            onClick={() => router.push('/classes')}
            className="text-blue-600 hover:text-blue-700"
          >
            Back to classes
          </button>
        </div>
      </div>
    );
  }

  const schedules = classItem.schedule || [];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => router.push('/classes')}
          className="text-blue-600 hover:text-blue-700 mb-6"
        >
          ← Back to classes
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  classItem.level === 'beginner'
                    ? 'bg-green-100 text-green-800'
                    : classItem.level === 'intermediate'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {classItem.level}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                  {classItem.category}
                </span>
              </div>
              <div className="text-3xl font-bold text-blue-600">
                ${classItem.price.toFixed(2)}
              </div>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {classItem.title}
            </h1>

            {classItem.long_description && (
              <p className="text-gray-700 mb-6 whitespace-pre-line">
                {classItem.long_description}
              </p>
            )}

            <p className="text-lg text-gray-600 mb-8">
              {classItem.description}
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center text-gray-700">
                <Clock className="w-5 h-5 mr-3 text-blue-600" />
                <div>
                  <p className="font-semibold">Duration</p>
                  <p className="text-sm text-gray-600">{classItem.duration_hours} hours</p>
                </div>
              </div>
              {classItem.max_students && (
                <div className="flex items-center text-gray-700">
                  <Users className="w-5 h-5 mr-3 text-blue-600" />
                  <div>
                    <p className="font-semibold">Max Students</p>
                    <p className="text-sm text-gray-600">{classItem.max_students} students</p>
                  </div>
                </div>
              )}
              <div className="flex items-center text-gray-700">
                <MapPin className="w-5 h-5 mr-3 text-blue-600" />
                <div>
                  <p className="font-semibold">Instructor</p>
                  <p className="text-sm text-gray-600">{classItem.instructor_name}</p>
                </div>
              </div>
            </div>

            {classItem.instructor_bio && (
              <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">About the Instructor</h3>
                <p className="text-gray-700">{classItem.instructor_bio}</p>
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Available Sessions</h3>
              {schedules.length === 0 ? (
                <p className="text-gray-600">No sessions available at this time.</p>
              ) : (
                <div className="space-y-3">
                  {schedules.map((schedule: ClassSchedule) => (
                    <label
                      key={schedule.id}
                      className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        selectedSchedule === schedule.id
                          ? 'border-blue-600 bg-blue-50'
                          : schedule.is_full
                          ? 'border-gray-300 bg-gray-50 opacity-60 cursor-not-allowed'
                          : 'border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="schedule"
                        value={schedule.id}
                        checked={selectedSchedule === schedule.id}
                        onChange={(e) => setSelectedSchedule(e.target.value)}
                        disabled={schedule.is_full}
                        className="sr-only"
                      />
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-4">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            <div>
                              <p className="font-semibold text-gray-900">
                                {format(new Date(schedule.start_date), 'EEEE, MMMM d, yyyy')}
                              </p>
                              <p className="text-sm text-gray-600">
                                {new Date(`2000-01-01T${schedule.start_time}`).toLocaleTimeString('en-US', {
                                  hour: 'numeric',
                                  minute: '2-digit',
                                })} - {new Date(`2000-01-01T${schedule.end_time}`).toLocaleTimeString('en-US', {
                                  hour: 'numeric',
                                  minute: '2-digit',
                                })}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">Timezone: {schedule.timezone}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          {schedule.is_full ? (
                            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                              Full
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                              Available ({schedule.enrolled_count}/{classItem.max_students || '∞'})
                            </span>
                          )}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleEnroll}
              disabled={!selectedSchedule || processing || schedules.length === 0 || schedules.find((s: any) => s.id === selectedSchedule)?.is_full}
              className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Processing...
                </>
              ) : !user ? (
                'Sign in to Enroll'
              ) : !selectedSchedule ? (
                'Select a Session'
              ) : (
                `Enroll Now - $${classItem.price.toFixed(2)}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

