import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  async downloadFile(url: string, fileName: string): Promise<void> {
    const a = document.createElement('a');
    a.href = await this.getDownloadUrl(url);
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  async getDownloadUrl(url: string): Promise<string>{
    const fetchResp = await fetch(url, {
      method: 'GET'
    });
    const data = await fetchResp.blob();
    return window.URL.createObjectURL(data);
  }
}
