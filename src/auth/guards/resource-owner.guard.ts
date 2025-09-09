import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { BlogsService } from '../../blogs/blogs.service';
import { CommentsService } from '../../comments/comments.service';
import { UserRole } from '../../users/schemas/user.schema';

@Injectable()
export class ResourceOwnerGuard implements CanActivate {
  constructor(
    private blogsService: BlogsService,
    private commentsService: CommentsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const resourceId = request.params.id;
    const resourceType = this.getResourceType(request.route.path);

    // Admin can access everything
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    try {
      let resource;
      
      switch (resourceType) {
        case 'blog':
          resource = await this.blogsService.findById(resourceId);
          return resource.author.toString() === user._id.toString();
          
        case 'comment':
          resource = await this.commentsService.findById(resourceId);
          return resource.author.toString() === user._id.toString();
          
        default:
          return false;
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        return false;
      }
      throw error;
    }
  }

  private getResourceType(path: string): string {
    if (path.includes('/blogs/')) return 'blog';
    if (path.includes('/comments/')) return 'comment';
    return 'unknown';
  }
}