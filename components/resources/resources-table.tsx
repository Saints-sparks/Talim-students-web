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
import { FileText, Image, Video, AlignLeft, Download } from "lucide-react";

const getFileIcon = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "pdf":
      return <FileText className="h-4 w-4" />;
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "webp":
      return <Image className="h-4 w-4" />;
    case "mp4":
    case "avi":
    case "mov":
    case "wmv":
      return <Video className="h-4 w-4" />;
    case "txt":
    case "docx":
    case "doc":
      return <AlignLeft className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

const handleDownload = (fileUrl: string, fileName: string) => {
  // Create a temporary anchor element to trigger download
  const link = document.createElement("a");
  link.href = fileUrl;
  link.download = fileName;
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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
                  {getFileIcon(resource.files[0] || resource.image)}
                  <span>{resource.name.toUpperCase()}</span>
                </div>
              </TableCell>
              <TableCell>
                <span
                  className="max-w-[200px] block truncate"
                  title={resource.courseId?.description || "No course assigned"}
                >
                  {resource.courseId?.description || "No course assigned"}
                </span>
              </TableCell>
              <TableCell className="text-[#616161]">
                {new Date(resource.uploadDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <span
                  className="max-w-[150px] block truncate"
                  title={`${resource.classId.classTeacherId.userId.firstName} ${resource.classId.classTeacherId.userId.lastName}`}
                >
                  {`${resource.classId.classTeacherId.userId.firstName} ${resource.classId.classTeacherId.userId.lastName}`}
                </span>
              </TableCell>
              <TableCell className="bg-[#ADBECE] hover:bg-blue-200">
                <button
                  onClick={() =>
                    handleDownload(
                      resource.files[0] || resource.image,
                      resource.name
                    )
                  }
                  className="flex items-center justify-center w-full py-4 text-sm text-white transition-colors hover:bg-blue-300"
                >
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
