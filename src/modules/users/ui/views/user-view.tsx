import UserSection from "../sections/user-section";
import VideosSection from "../sections/videos-section";

interface UserViewProps {
  userId: string;
}

function UserView({ userId }: UserViewProps) {
  return (
    <div className="flex flex-col gap-y-6 px-4 pt-2.5 max-w-[1300px] mx-auto mb-10">
      <UserSection userId={userId} />
      <VideosSection userId={userId} />
    </div>
  );
}

export default UserView;
