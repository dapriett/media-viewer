import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  async printDocumentNatively(documentUrl: string): Promise<void> {
    const document = await fetch(documentUrl, {
      method: 'GET'
    });
    const data = await document.blob();
    const printUrl = window.URL.createObjectURL(data);
    window.open(printUrl)
          .print();
  }

  printElementNatively(element: HTMLElement, width: number, height: number): void {
    const printWindow = window.open('', '', `left=0,top=0,width=${width},height=${height},toolbar=0,scrollbars=0,status=0`);

    printWindow.document.write(element.innerHTML);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }
}
