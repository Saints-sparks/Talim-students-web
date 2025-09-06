"use client";

import { ChevronDown, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface Subject {
  name: string;
  testScore: string;
}
const subjects: Subject[] = [
  { name: "Mathematics", testScore: "A" },
  { name: "English Language", testScore: "B" },
  { name: "Basic Science", testScore: "C" },
  { name: "Social Studies", testScore: "B" },
  { name: "Computer Studies", testScore: "A" },
  { name: "Creative Arts", testScore: "A" },
];

export default function ResultsDashboard() {
  return (
    <div className="h-screen p-4 md:p-6">
      <div className="mx-auto container space-y-5 sm:space-y-10">
        {/* Results Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-medium text-[#2F2F2F]">Results</h1>
            <p className=" text-[#AAAAAA]">
              Everything your teachers shared for you!
            </p>
          </div>
          <div className="flex gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 shadow-none text-[#898989] rounded-lg h-[40px] sm:h-[50px] font-medium text-sm"
                >
                  View <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Current Term</DropdownMenuItem>
                <DropdownMenuItem>Previous Term</DropdownMenuItem>
                <DropdownMenuItem>All Results</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button className=" bg-[#003366] hover:bg-blue-800 rounded-lg h-[40px] sm:h-[50px]">
              Download Results
            </Button>
          </div>
        </div>

        {/* Results Table */}
        <div className="rounded-lg border border-[#F0F0F0] bg-white overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]"></TableHead>
                <TableHead className="align-bottom  pb-3">
                  <div className="flex items-center gap-2 text-[#030E18]">
                    <Checkbox className="h-4 w-4 border-[#E1E1E1] shadow-none" />
                    Course
                  </div>
                </TableHead>
                <TableHead className="text-left text-[#030E18] align-bottom pb-3">
                  Grade
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.map((subject) => (
                <TableRow key={subject.name}>
                  <TableCell className=""></TableCell>
                  <TableCell className="font-[16px] text-[#030303]">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      {subject.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-left">
                    {subject.testScore}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
