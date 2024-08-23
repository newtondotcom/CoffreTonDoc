import type { ColumnDef } from '@tanstack/vue-table';
import { h } from 'vue';
import type { File } from '@prisma/client';
import Thumbnail from '@/components/icons/Thumbnail.vue';
import { filesize } from 'filesize';
import Date from '../icons/Date.vue';
import DropdownAction from './DataTableDropDown.vue';

export const columns: ColumnDef<File>[] = [
    {
        accessorKey: 'date',
        header: () => h('div', { class: 'text-center' }, 'Date'),
        size: 200,
        cell: ({ row }) => {
            const date: string = row.getValue('date');
            return h('div', { class: 'text-center' }, [h(Date, { date: date })]);
        },
        enableResizing: true,
    },
    {
        accessorKey: 'name',
        header: () => h('div', { class: 'text-center' }, 'Name'),
        cell: ({ row }) => {
            const file = row.original;
            const extension = file.extension || '';
            return h('div', { class: 'text-center font-medium flex items-center justify-end' }, [
                h(Thumbnail, { extension: extension }),
                h('span', { class: 'ml-2' }, file.name),
            ]);
        },
        size: 400,
        enableResizing: true,
    },
    {
        accessorKey: 'size',
        header: () => h('div', { class: 'text-center' }, 'Size'),
        cell: ({ row }) => {
            const size = Number.parseFloat(row.getValue('size'));
            const formatted = filesize(size, { round: 0 });

            return h('div', { class: 'text-right font-medium' }, formatted);
        },
        size: 200,
        enableResizing: true,
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const file = row.original;

            return h(
                'div',
                { class: 'relative' },
                h(DropdownAction, {
                    file,
                }),
            );
        },
        enableResizing: true,
    },
];
