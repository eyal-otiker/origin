import { MixcloudPictures } from "./mix-cloud-picutres.interface";
import { MixcloudUser } from "./mix-cloud-user.interface";

export interface MixcloudCloudcastItem {
  key: string;               
  name: string;              
  url: string;               
  user?: MixcloudUser;      
  pictures?: MixcloudPictures; 
  created_time?: string;
  updated_time?: string;  
}