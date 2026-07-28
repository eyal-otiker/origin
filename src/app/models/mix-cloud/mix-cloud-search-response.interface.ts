import { MixcloudCloudcastItem } from "./mix-cloud-cloud-cast-item.interface";
import { MixcloudPaging } from "./mix-cloud-paging.interface";

export interface MixcloudSearchResponse {
  data: MixcloudCloudcastItem[]; 
  paging?: MixcloudPaging;    
  name?: string;            
}