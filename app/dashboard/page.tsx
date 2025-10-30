'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Calendar, Clock, Video, Mail, Loader2, ExternalLink } from 'lucide-react';
import { Enrollment } from '@/types/database';
import { format } from 'date-fns';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/login?redirect=/dashboard');
      return;
    }
    setUser(session.user);
    fetchEnrollments(session.user.id);
  };

  const fetchEnrollments = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          class:classes (*),
          schedule:class_schedules (*)
        `)
        .eq('user_id', userId)
        .eq('status', 'confirmed')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEnrollments(data || []);
    } catch (error) {
      console.error('Failed to fetch enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            My Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {user?.email}! Here are your enrolled classes.
          </p>
        </div>

        {enrollments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No Enrollments Yet
            </h2>
            <p className="text-gray-600 mb-6">
              You haven't enrolled in any classes yet. Browse our available classes to get started!
            </p>
            <Link
              href="/classes"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Browse Classes
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {enrollments.map((enrollment: any) => {
              const classData = enrollment.class;
              const schedule = enrollment.schedule;

              if (!classData || !schedule) return null;

              const classDate = new Date(schedule.start_date);
              const startTime = new Date(`2000-01-01T${schedule.start_time}`);
              const endTime = new Date(`2000-01-01T${schedule.end_time}`);
              const isUpcoming = classDate >= new Date();

              return (
                <div
                  key={enrollment.id}
                  className={`bg-white rounded-xl shadow-lg overflow-hidden ${
                    !isUpcoming ? 'opacity-75' : ''
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">
                          {classData.title}
                        </h2>
                        <p className="text-sm text-gray-600">
                          {classData.category} • {classData.level}
                        </p>
                      </div>
                      {isUpcoming && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                          Upcoming
                        </span>
                      )}
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-gray-700">
                        <Calendar className="w-5 h-5 mr-3 text-blue-600" />
                        <div>
                          <p className="font-semibold">Class Date</p>
                          <p className="text-sm text-gray-600">
                            {format(classDate, 'EEEE, MMMM d, yyyy')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center text-gray-700">
                        <Clock className="w-5 h-5 mr-3 text-blue-600" />
                        <div>
                          <p className="font-semibold">Time</p>
                          <p className="text-sm text-gray-600">
                            {startTime.toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                            })} - {endTime.toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>

                      {classData.meeting_link && (
                        <div className="flex items-center text-gray-700">
                          <Video className="w-5 h-5 mr-3 text-blue-600" />
                          <div className="flex-1">
                            <p className="font-semibold">Meeting Link</p>
                            <a
                              href={classData.meeting_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                            >
                              Join Class
                              <ExternalLink className="w-4 h-4 ml-1" />
                            </a>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center text-gray-700">
                        <Mail className="w-5 h-5 mr-3 text-blue-600" />
                        <div>
                          <p className="font-semibold">Instructor</p>
                          <p className="text-sm text-gray-600">
                            {classData.instructor_name}
                          </p>
                        </div>
                      </div>
                    </div>

                    {classData.long_description && (
                      <div className="mb-6">
                        <h3 className="font-semibold text-gray-900 mb-2">About This Class</h3>
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {classData.description}
                        </p>
                      </div>
                    )}

                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        Enrolled on {format(new Date(enrollment.created_at), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

