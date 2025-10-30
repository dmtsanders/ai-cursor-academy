import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

// Be permissive with the context type to support different Next.js signatures
export async function GET(
  request: NextRequest,
  context: any
) {
  try {
    const supabase = createServerClient();
    // Support both context.params and Promise<context.params>
    const rawParams = context?.params;
    const resolvedParams = typeof rawParams?.then === 'function' ? await rawParams : rawParams;
    const classId: string = resolvedParams?.id;

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

