output "vpc_id" {
  value       = aws_vpc.main.id
  description = "VPC ID"
}

output "s3_bucket_name" {
  value       = aws_s3_bucket.documents.id
  description = "S3 bucket name"
}

output "rds_endpoint" {
  value       = aws_db_instance.mysql.endpoint
  description = "RDS endpoint"
}

output "redis_endpoint" {
  value       = aws_elasticache_cluster.redis.cache_nodes[0].address
  description = "Redis endpoint"
}

output "alb_dns_name" {
  value       = aws_lb.main.dns_name
  description = "Load balancer DNS"
}
