'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';
import { TimeSlotFormSchema } from '@/app/lib/definitions';
import { createTimeSlot } from '@/app/lib/actions';

export function ImportTimeSlotsButton() {
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setLoading(true);
    const promise = () =>
      new Promise(async (resolve, reject) => {
        try {
          const data = await file.arrayBuffer();
          const workbook = XLSX.read(data, { type: 'array', cellDates: true });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json: Record<string, any>[] = XLSX.utils.sheet_to_json(
            worksheet,
            { UTC: true }
          );

          if (json.length === 0) {
            return reject(new Error('Tập tin không chứa dữ liệu.'));
          }

          const createdTimeSlots = [];
          const errors: { row: number; error: any }[] = [];

          for (let i = 0; i < json.length; i++) {
            const row = json[i];
            const validatedFields = TimeSlotFormSchema.safeParse({
              date: row.date,
              start: row.start,
              end: row.end,
            });
            if (validatedFields.success) {
              const formData = new FormData();
              Object.keys(validatedFields.data).forEach((key: any) => {
                formData.append(
                  key,
                  (validatedFields.data as Record<string, any>)[key]
                );
              });
              const result = await createTimeSlot(null, formData);
              if (result?.success) {
                createdTimeSlots.push(validatedFields.data);
              } else {
                errors.push({ row: i + 2, error: result?.message });
              }
            } else {
              errors.push({
                row: i + 2,
                error: validatedFields.error.flatten().fieldErrors,
              });
            }
          }

          if (errors.length > 0) {
            const errorMessages = errors
              .map(
                (e) =>
                  `Row ${e.row}: ${
                    typeof e.error === 'string'
                      ? e.error
                      : JSON.stringify(e.error)
                  }`
              )
              .join('\n');
            reject(
              new Error(
                `Một số khung giờ không thể được tạo: ${errorMessages}\n`
              )
            );
          } else {
            resolve(`Đã tạo thành công ${createdTimeSlots.length} khung giờ.`);
          }
        } catch {
          reject(new Error('Không thể xử lý tập tin Excel.'));
        } finally {
          setLoading(false);
        }
      });

    toast.promise(promise, {
      loading: 'Đang tải...',
      success: (message) => `${message}`,
      error: (error) => error.message,
    });
  };

  return (
    <div>
      <label
        htmlFor="import-time-slots"
        className="flex h-10 items-center rounded-lg bg-blue-600 px-2 sm:px-4 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 cursor-pointer"
      >
        {loading ? 'Đang tải...' : 'Tải lên khung giờ'}
      </label>
      <input
        id="import-time-slots"
        type="file"
        accept=".xlsx, .xls"
        className="hidden"
        onChange={handleFileChange}
        disabled={loading}
      />
    </div>
  );
}
