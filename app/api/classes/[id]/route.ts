import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    const classId = params.id;

    const { data: classData, error } = await supabase
      .from('classes')
      .select(`
        *,
        class_schedules (*)
      `)
      .eq('id', classId)
      .eq('is_active', true)
      .single();

    if (error) throw error;

    if (!classData) {
      return NextResponse.json(
        { error: 'Class not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ class: classData });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch class' },
      { status: 500 }
    );
  }
}

