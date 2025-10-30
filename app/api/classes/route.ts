import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = createServerClient();
    
    const { data: classes, error } = await supabase
      .from('classes')
      .select(`
        *,
        class_schedules (*)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ classes: classes || [] });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch classes' },
      { status: 500 }
    );
  }
}

