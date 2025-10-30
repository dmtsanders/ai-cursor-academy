'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2, Plus, Edit, Trash2, Calendar, Users, DollarSign, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalEnrollments: 0,
    totalRevenue: 0,
    upcomingClasses: 0,
  });

  useEffect(() => {
    checkAuth();
    fetchStats();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/login?redirect=/admin');
      return;
    }
    
    setUser(session.user);
    
    // Check if user is admin
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();
    
    if (userData?.role === 'admin') {
      setIsAdmin(true);
    } else {
      router.push('/dashboard');
    }
    
    setLoading(false);
  };

  const fetchStats = async () => {
    try {
      const { data: classes } = await supabase
        .from('classes')
        .select('id', { count: 'exact' });
      
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('id', { count: 'exact' });
      
      const { data: payments } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'succeeded');
      
      const { data: schedules } = await supabase
        .from('class_schedules')
        .select('start_date')
        .gte('start_date', new Date().toISOString().split('T')[0]);
      
      const revenue = payments?.reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0;
      
      setStats({
        totalClasses: classes?.length || 0,
        totalEnrollments: enrollments?.length || 0,
        totalRevenue: revenue,
        upcomingClasses: schedules?.length || 0,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage classes, enrollments, and payments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Classes</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalClasses}</p>
              </div>
              <BookOpen className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Enrollments</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalEnrollments}</p>
              </div>
              <Users className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="w-12 h-12 text-yellow-600 opacity-20" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Upcoming Classes</p>
                <p className="text-3xl font-bold text-gray-900">{stats.upcomingClasses}</p>
              </div>
              <Calendar className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link
            href="/admin/classes"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <BookOpen className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Classes</h3>
            <p className="text-sm text-gray-600">Create, edit, and delete classes</p>
          </Link>
          
          <Link
            href="/admin/enrollments"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <Users className="w-8 h-8 text-green-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Enrollments</h3>
            <p className="text-sm text-gray-600">View and manage student enrollments</p>
          </Link>
          
          <Link
            href="/admin/payments"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <DollarSign className="w-8 h-8 text-yellow-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Payments</h3>
            <p className="text-sm text-gray-600">View payment history and records</p>
          </Link>
          
          <Link
            href="/admin/schedules"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <Calendar className="w-8 h-8 text-purple-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Schedules</h3>
            <p className="text-sm text-gray-600">Manage class schedules and times</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

