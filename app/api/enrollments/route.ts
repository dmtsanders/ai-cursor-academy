import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Extract user ID from token (you might want to verify the token first)
    // For now, we'll use the session from Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: enrollments, error } = await supabase
      .from('enrollments')
      .select(`
        *,
        class:classes (*),
        schedule:class_schedules (*)
      `)
      .eq('user_id', user.id)
      .eq('status', 'confirmed')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ enrollments: enrollments || [] });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch enrollments' },
      { status: 500 }
    );
  }
}

