import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

type RouteContext = { params: Promise<{ id: string }> } | { params: { id: string } };

export async function GET(
  request: NextRequest,
  context: RouteContext
) : Promise<NextResponse> {
  try {
    const supabase = createServerClient();
    // Support both context.params and Promise<context.params>
    // @ts-expect-error - Next.js may pass params as a Promise in v16
    const rawParams = (context as any)?.params;
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

