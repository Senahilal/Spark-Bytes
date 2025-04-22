"use client";
import { useState, ChangeEvent } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { uploadProfileImage, updateUserProfileImageUrl } from "../firebase/repository";
import { auth } from "@/app/firebase/config";


export default function ProfileUploader() {
  const [user] = useAuthState(auth);
  const [file, setFile] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!user || !file) {
      alert("Select a file and ensure you're logged in.");
      return;
    }

    const url = await uploadProfileImage(user.uid, file);
    if (url) {
        await updateUserProfileImageUrl(user.uid, url);
        alert("Profile image updated!");
        setProfileImageUrl(url);
    } else {
        alert("Upload failed, please try again.");
    }
  };

    
  return (
    <>
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Image</button>
    </div>
    <div>
        {file && (
            <div>
            <h3>Selected File:</h3>
            <p>{file.name}</p>
            <img src={URL.createObjectURL(file)} alt="Preview" style={{ width: "512px", height: "512px" }} />
            </div>
        )}
    </div>
    <div>
        {profileImageUrl && (
            <div>
            <h3>New Profile Image:</h3>
            <img src={profileImageUrl} alt="Profile" style={{ width: "512px", height: "512px" }} />
            </div>
        )}
    </div>
    
    </>
  );
}