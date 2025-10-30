'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Calendar, Clock, DollarSign, Users, ArrowRight } from 'lucide-react';
import { Class } from '@/types/database';
import { format } from 'date-fns';

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Fetch classes
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes');
      const data = await response.json();
      setClasses(data.classes || []);
    } catch (error) {
      console.error('Failed to fetch classes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading classes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Available Classes
          </h1>
          <p className="text-xl text-gray-600">
            Choose a class to accelerate your AI-assisted coding journey
          </p>
        </div>

        {classes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No classes available at the moment.</p>
            <p className="text-gray-500 mt-2">Check back soon for new classes!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {classes.map((classItem) => (
              <div
                key={classItem.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      classItem.level === 'beginner'
                        ? 'bg-green-100 text-green-800'
                        : classItem.level === 'intermediate'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {classItem.level}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                      {classItem.category}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {classItem.title}
                  </h2>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {classItem.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      {classItem.duration_hours} hours
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {classItem.schedule?.length || 0} session{classItem.schedule?.length !== 1 ? 's' : ''} available
                    </div>
                    {classItem.max_students && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        Max {classItem.max_students} students
                      </div>
                    )}
                    <div className="flex items-center text-lg font-bold text-blue-600">
                      <DollarSign className="w-5 h-5 mr-1" />
                      ${classItem.price.toFixed(2)}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Instructor: {classItem.instructor_name}</p>
                  </div>

                  {classItem.schedule && classItem.schedule.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Upcoming Sessions:</p>
                      <div className="space-y-1">
                        {classItem.schedule.slice(0, 2).map((schedule: any) => (
                          <div key={schedule.id} className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                            {format(new Date(schedule.start_date), 'MMM d, yyyy')} at{' '}
                            {new Date(`2000-01-01T${schedule.start_time}`).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                            {schedule.is_full && (
                              <span className="ml-2 text-red-600">(Full)</span>
                            )}
                          </div>
                        ))}
                        {classItem.schedule.length > 2 && (
                          <p className="text-xs text-gray-500">
                            +{classItem.schedule.length - 2} more session{classItem.schedule.length - 2 !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <Link
                    href={`/classes/${classItem.id}`}
                    className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    View Details
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

