`import * as XLSX from 'xlsx';

export async function POST(request) {
  try {
    const body = await request.json();
    const rows = Array.isArray(body?.rows) ? body.rows : [];

    if (!rows.length) {
      return Response.json({ error: 'No rows provided for export.' }, { status: 400 });
    }

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="store-leads.xlsx"'
      }
    });
  } catch (error) {
    return Response.json(
      { error: error.message || 'Export failed.' },
      { status: 500 }
    );
  }
}
