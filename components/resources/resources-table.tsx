"use client";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useResources } from "@/hooks/useResource";
import { Resource } from "@/services/resource.service";
import { FileText, Image, Video, AlignLeft, Download } from "lucide-react";

const getFileIcon = (type: Resource["type"]) => {
  switch (type) {
    case "pdf":
      return <FileText className="h-4 w-4" />;
    case "img":
      return <Image className="h-4 w-4" />;
    case "vid":
      return <Video className="h-4 w-4" />;
    case "txt":
      return <AlignLeft className="h-4 w-4" />;
  }
};

export function ResourcesTable() {
  const { isLoading, resources } = useResources();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Checkbox /> Name
          </TableHead>
          <TableHead>Course</TableHead>
          <TableHead>Upload Date</TableHead>
          <TableHead>Teacher's Name</TableHead>
          <TableHead>Download file</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-4 text-gray-500">
              Loading resources...
            </TableCell>
          </TableRow>
        ) : (
          resources.map((resource) => (
            <TableRow key={resource._id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getFileIcon(resource.type)}
                  <span>{resource.name.toUpperCase()}</span>
                </div>
              </TableCell>
              <TableCell>{resource.subject}</TableCell>
              <TableCell className="text-[#616161]">
                {new Date(resource.uploadDate).toLocaleDateString()}
              </TableCell>
              <TableCell>{resource.uploadedBy}</TableCell>
              <TableCell className="bg-[#ADBECE] hover:bg-blue-200">
                <button className="flex items-center justify-center w-full py-4 text-sm text-white transition-colors">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
