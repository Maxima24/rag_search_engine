import { Body, Controller, Delete, Get, HttpCode, Param, Post } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { PrismaService } from '../prisma/prisma.service';
import { CREATEDOCDTO } from './dto/create_doc.dto';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {
  }
    @Post("/")
    @HttpCode(201)
    public async createDocs(@Body() body:CREATEDOCDTO){
       return await this.documentsService.createDoc(body)
    }
    @Get(":id")
    @HttpCode(200)
    public async getDocbyId(@Param('id') id:string){
      return await this.documentsService.findOne(id)
    }
    @Get("")
    @HttpCode(200)
    public async getAllDocs(){
      return await this.documentsService.findAll()
    }
    
    @Delete(":id")
    @HttpCode(200)
    public async deleteDoc(@Param("id") id:string){
      return await this.documentsService.remove(id)
    }
}

