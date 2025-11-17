import ConfirmConvertDialog from "@/components/organisms/ConfirmConvertDialog";
import Converter from "@/components/organisms/Converter";

export default function Home() {
  return (
    <div className="flex flex-col px-4 md:px-10">
      <Converter />

      <ConfirmConvertDialog />
    </div>
  );
}
