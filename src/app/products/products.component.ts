import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../products.service';
import { Product } from '../product.model';
import { HttpResponse } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products: Product[] = [];
  columns: string[] = [];

  constructor( private productsService: ProductsService ) { }

  ngOnInit(): void {
    this.getProducts();
    this.columns = ['id', 'name', 'description', 'price', 'quantity', 'img'];
  }

  getProducts(){
    this.productsService.getProducts()
    .subscribe((data: HttpResponse<any>) =>{
     console.log(data.body);
     this.products = data.body;
    });
  }

  firstPage() {
    this.productsService.sendRequestToUrl(this.productsService.first)
    .subscribe((res: HttpResponse<any>) =>{
      this.products = res.body;
    });
  }

  lastPage() {
    this.productsService.sendRequestToUrl(this.productsService.last)
    .subscribe((res: HttpResponse<any>) =>{
      this.products = res.body;
    });
  }

  previousPage() {
    console.log(this.productsService.prev);
    if(this.productsService.prev && this.productsService.prev !== ''){
      this.productsService.sendRequestToUrl(this.productsService.prev)
      .subscribe((res: HttpResponse<any>) =>{
        this.products = res.body;
      });
    }
  }

  nextPage() {
    console.log(this.productsService.next);
    if(this.productsService.next && this.productsService.next !== ''){
      this.productsService.sendRequestToUrl(this.productsService.next)
      .subscribe((res: HttpResponse<any>) =>{
        this.products = res.body;
      });
    }
  }

}
